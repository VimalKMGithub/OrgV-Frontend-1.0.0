import { useReducer, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { validateOtp, validatePassword } from '../../commons/utils/validationUtility';
import { deleteAccount, deleteAccountMethodSelection, verifyDeleteAccount, type DeleteAccountMethodSelectionResponse, type DeleteAccountResponse } from '../api/userApis';
import { initialDeleteAccountState, deleteAccountReducer } from '../reducers/deleteAccountReducer';

export const useDeleteAccount = () => {
    const [state, dispatch] = useReducer(deleteAccountReducer, initialDeleteAccountState);
    const { localLogout } = useAuth();
    const navigate = useNavigate();

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const passwordError = validatePassword(state.password);
        if (passwordError) {
            dispatch({ type: 'SET_ERRORS', payload: { password: passwordError } });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: DeleteAccountResponse = await deleteAccount({
                password: state.password
            });
            if (response.message === 'Account deleted successfully') {
                toast.success('Account deleted successfully.');
                localLogout();
                navigate('/login');
            } else if (response.methods) {
                dispatch({ type: 'SET_MFA_METHODS', payload: response.methods });
                dispatch({ type: 'SET_STEP', payload: 'SELECT_MFA' });
                toast.info(response.message);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('password')) {
                    dispatch({ type: 'SET_ERRORS', payload: { password: errorMessage } });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to initiate account deletion.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleMethodSelection = async (method: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_SELECTED_METHOD', payload: method });
        try {
            const response: DeleteAccountMethodSelectionResponse = await deleteAccountMethodSelection({
                method
            });
            toast.success(response.message);
            dispatch({ type: 'SET_STEP', payload: 'VERIFY_MFA' });
            dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: 300 });
            if (method === 'EMAIL_MFA') {
                dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to select MFA method.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleVerifySubmit = async (e: FormEvent) => {
        e.preventDefault();
        const otpError = validateOtp(state.otp, 6);
        if (otpError) {
            dispatch({ type: 'SET_ERRORS', payload: { otp: otpError } });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await verifyDeleteAccount({
                otpTotp: state.otp,
                method: state.selectedMethod
            });
            toast.success('Account deleted successfully.');
            localLogout();
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('otp')) {
                    dispatch({ type: 'SET_ERRORS', payload: { otp: errorMessage } });
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
        if (state.resendCountdown > 0 || !state.selectedMethod) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: DeleteAccountMethodSelectionResponse = await deleteAccountMethodSelection({
                method: state.selectedMethod
            });
            toast.success(response.message || 'OTP resent successfully');
            dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to resend OTP.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (state.sessionCountdown > 0) {
            timer = setInterval(() => {
                dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: state.sessionCountdown - 1 });
            }, 1000);
        } else if (state.sessionCountdown === 0 && state.step === 'VERIFY_MFA') {
            toast.warning('Session expired. Please try again.');
            dispatch({ type: 'SET_STEP', payload: 'SELECT_MFA' });
            dispatch({ type: 'SET_OTP', payload: '' });
            dispatch({ type: 'SET_ERRORS', payload: {} });
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
        handlePasswordSubmit,
        handleMethodSelection,
        handleVerifySubmit,
        handleResendOtp,
        navigate,
    };
};
