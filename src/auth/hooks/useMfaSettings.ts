import { useReducer, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { requestToToggleMfa, verifyToToggleMfa, type RequestToToggleMfaResponse, type VerifyToToggleMfaResponse } from '../api/authApis';
import { validateOtp } from '../../commons/utils/validationUtility';
import { initialMfaSettingsState, mfaSettingsReducer } from '../reducers/mfaSettingsReducer';

export const useMfaSettings = () => {
    const [state, dispatch] = useReducer(mfaSettingsReducer, initialMfaSettingsState);
    const { user, localLogout, checkAuth } = useAuth();
    const navigate = useNavigate();

    const hasEmailMfa = user?.mfaMethods?.includes('EMAIL_MFA');
    const hasAuthAppMfa = user?.mfaMethods?.includes('AUTHENTICATOR_APP_MFA');

    const handleToggleRequest = async (method: string, enable: boolean) => {
        dispatch({ type: 'SET_ACTIVE_METHOD', payload: method });
        dispatch({ type: 'SET_IS_ENABLING', payload: enable });
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: '' });
        dispatch({ type: 'SET_QR_CODE_URL', payload: null });
        try {
            const response: RequestToToggleMfaResponse | Blob = await requestToToggleMfa({
                type: method,
                toggle: enable ? 'enable' : 'disable'
            });
            if (method === 'AUTHENTICATOR_APP_MFA' && enable) {
                const url = URL.createObjectURL(response as Blob);
                dispatch({ type: 'SET_QR_CODE_URL', payload: url });
                toast.info('Scan the QR code with your Authenticator App.');
            } else {
                const data = response as { message?: string };
                toast.success(data.message);
                if (method === 'EMAIL_MFA') {
                    dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
                }
            }
            dispatch({ type: 'SET_STEP', payload: 'VERIFY' });
            dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: 300 });
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to request MFA change.');
            }
            dispatch({ type: 'SET_ACTIVE_METHOD', payload: null });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        const otpError = validateOtp(state.otp, 6);
        if (otpError) {
            dispatch({ type: 'SET_ERROR', payload: otpError });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: VerifyToToggleMfaResponse = await verifyToToggleMfa({
                type: state.activeMethod,
                toggle: state.isEnabling ? 'enable' : 'disable',
                otpTotp: state.otp
            });
            toast.success(response.message);
            if (response.message && response.message.toLowerCase().includes('log in again')) {
                localLogout();
                navigate('/login');
            } else {
                await checkAuth();
                dispatch({ type: 'RESET_VERIFY' });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('otp')) {
                    dispatch({ type: 'SET_ERROR', payload: errorMessage });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Verification failed.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleResendOtp = async () => {
        if (state.resendCountdown > 0 || !state.activeMethod) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: RequestToToggleMfaResponse | Blob = await requestToToggleMfa({
                type: state.activeMethod,
                toggle: state.isEnabling ? 'enable' : 'disable'
            });
            if (state.activeMethod === 'EMAIL_MFA') {
                const data = response as { message?: string };
                toast.success(data.message || 'OTP resent successfully');
                dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message);
            } else {
                toast.error('Failed to resend OTP.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const cancelToggle = () => {
        dispatch({ type: 'RESET_VERIFY' });
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (state.sessionCountdown > 0) {
            timer = setInterval(() => {
                dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: state.sessionCountdown - 1 });
            }, 1000);
        } else if (state.sessionCountdown === 0 && state.step === 'VERIFY') {
            toast.warning('Session expired. Please try again.');
            dispatch({ type: 'RESET_VERIFY' });
        }
        return () => clearInterval(timer);
    }, [state.sessionCountdown, state.step]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (state.resendCountdown > 0) {
            timer = setInterval(() => {
                dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: state.resendCountdown - 1 });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [state.resendCountdown]);

    return {
        state,
        dispatch,
        hasEmailMfa,
        hasAuthAppMfa,
        handleToggleRequest,
        handleVerify,
        cancelToggle,
        handleResendOtp,
    };
};
