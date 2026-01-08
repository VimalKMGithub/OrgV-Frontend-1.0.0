import { useReducer, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { validateOtp, validatePassword } from '../../commons/utils/validationUtility';
import { changePassword, changePasswordMethodSelection, verifyChangePassword, type ChangePasswordMethodSelectionResponse, type ChangePasswordResponse } from '../api/userApis';
import { initialChangePasswordState, changePasswordReducer } from '../reducers/changePasswordReducer';

export const useChangePassword = () => {
    const [state, dispatch] = useReducer(changePasswordReducer, initialChangePasswordState);
    const { localLogout } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const oldPasswordError = validatePassword(state.oldPassword);
        if (oldPasswordError) {
            newErrors.oldPassword = oldPasswordError;
        }
        const passwordError = validatePassword(state.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }
        if (state.newPassword !== state.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Confirm password does not match';
        }
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: ChangePasswordResponse = await changePassword({
                oldPassword: state.oldPassword,
                newPassword: state.newPassword,
                confirmNewPassword: state.confirmNewPassword
            });
            if (response.methods && response.methods.length > 0) {
                dispatch({ type: 'SET_MFA_METHODS', payload: response.methods });
                dispatch({ type: 'SET_STEP', payload: 'SELECT_MFA' });
                toast.info(response.message);
            } else {
                toast.success('Password changed successfully. Please login again.');
                localLogout();
                navigate('/login');
            }
        } catch (error: any) {
            const newErrors: Record<string, string> = {};
            const mapErrorToField = (err: string) => {
                const lowerCaseError = err.toLowerCase();
                if (lowerCaseError.includes('old')) {
                    newErrors.oldPassword = err;
                } else {
                    toast.error(err);
                }
            };
            if (error.response?.data?.message) {
                mapErrorToField(error.response.data.message);
            } else {
                toast.error('Failed to change password.');
            }
            if (Object.keys(newErrors).length > 0) {
                dispatch({ type: 'SET_ERRORS', payload: newErrors });
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleMethodSelection = async (method: string) => {
        dispatch({ type: 'SET_LOADING_METHOD', payload: method });
        try {
            const response: ChangePasswordMethodSelectionResponse = await changePasswordMethodSelection({ method });
            dispatch({ type: 'SET_SELECTED_METHOD', payload: method });
            dispatch({ type: 'SET_STEP', payload: 'VERIFY_MFA' });
            dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: 300 });
            if (method === 'EMAIL_MFA') {
                dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
            }
            toast.success(response.message);
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to select MFA method.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
        }
    };

    const handleVerifyMfa = async (e: FormEvent) => {
        e.preventDefault();
        const otpError = validateOtp(state.otp, 6);
        if (otpError) {
            dispatch({ type: 'SET_ERRORS', payload: { otp: otpError } });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await verifyChangePassword({
                oldPassword: state.oldPassword,
                newPassword: state.newPassword,
                confirmNewPassword: state.confirmNewPassword,
                method: state.selectedMethod,
                otpTotp: state.otp
            });
            toast.success('Password changed successfully. Please login again.');
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
        dispatch({ type: 'SET_LOADING_METHOD', payload: state.selectedMethod });
        try {
            const response: ChangePasswordMethodSelectionResponse = await changePasswordMethodSelection({
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
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
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
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
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
        handleVerifyMfa,
        handleResendOtp,
    };
};
