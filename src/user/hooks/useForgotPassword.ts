import { useReducer, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateUserIdentifier, validateOtp, validatePassword } from '../../commons/utils/validationUtility';
import {
    forgotPassword,
    forgotPasswordMethodSelection,
    resetPassword,
    type ForgotPasswordMethodSelectionResponse,
    type ForgotPasswordResponse,
    type ResetPasswordResponse
} from '../api/userApis';
import { initialForgotPasswordState, forgotPasswordReducer } from '../reducers/forgotPasswordReducer';

export const useForgotPassword = () => {
    const [state, dispatch] = useReducer(forgotPasswordReducer, initialForgotPasswordState);
    const navigate = useNavigate();

    const handleIdentifierSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validateUserIdentifier(state.identifier);
        if (validationError) {
            dispatch({ type: 'SET_ERROR', payload: validationError });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: ForgotPasswordResponse = await forgotPassword({
                usernameOrEmailOrId: state.identifier
            });
            const availableMethods = response.methods || [];
            if (availableMethods.length === 0) {
                toast.error('No recovery methods available for this account.');
                return;
            }
            dispatch({ type: 'SET_METHODS', payload: availableMethods });
            dispatch({ type: 'SET_STEP', payload: 'SELECT_METHOD' });
            toast.success(response.message);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('user')) {
                    dispatch({ type: 'SET_ERROR', payload: errorMessage });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to process request.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleMethodSelection = async (method: string) => {
        dispatch({ type: 'SET_LOADING_METHOD', payload: method });
        try {
            const response: ForgotPasswordMethodSelectionResponse = await forgotPasswordMethodSelection({
                usernameOrEmailOrId: state.identifier,
                method: method
            });
            toast.success(response.message);
            dispatch({ type: 'SET_SELECTED_METHOD', payload: method });
            dispatch({ type: 'SET_STEP', payload: 'RESET_PASSWORD' });
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
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
        }
    };

    const handleResetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_RESET_FORM_DATA', payload: { [name]: value } });
        if (state.resetErrors[name]) {
            dispatch({ type: 'SET_RESET_ERRORS', payload: { ...state.resetErrors, [name]: '' } });
        }
    };

    const validateResetForm = () => {
        const newErrors: Record<string, string> = {};
        const otpError = validateOtp(state.resetFormData.otpTotp);
        if (otpError) {
            newErrors.otpTotp = otpError;
        }
        const passwordError = validatePassword(state.resetFormData.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }
        if (state.resetFormData.newPassword !== state.resetFormData.confirmNewPassword) {
            newErrors.confirmNewPassword = "Confirm password does not match";
        }
        dispatch({ type: 'SET_RESET_ERRORS', payload: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handleResetSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateResetForm()) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: ResetPasswordResponse = await resetPassword({
                usernameOrEmailOrId: state.identifier,
                otpTotp: state.resetFormData.otpTotp,
                newPassword: state.resetFormData.newPassword,
                confirmNewPassword: state.resetFormData.confirmNewPassword,
                method: state.selectedMethod || 'EMAIL_MFA',
            });
            toast.success(response.message);
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const newErrors: Record<string, string> = {};
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('otp')) {
                    newErrors.otpTotp = errorMessage;
                } else {
                    toast.error(errorMessage);
                }
                if (Object.keys(newErrors).length > 0) {
                    dispatch({ type: 'SET_RESET_ERRORS', payload: newErrors });
                }
            } else {
                toast.error('Failed to reset password. Please try again.');
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
            const response: ForgotPasswordMethodSelectionResponse = await forgotPasswordMethodSelection({
                usernameOrEmailOrId: state.identifier,
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
        } else if (state.sessionCountdown === 0 && state.step === 'RESET_PASSWORD') {
            toast.warning('Session expired. Please try again.');
            dispatch({ type: 'SET_STEP', payload: 'INPUT_ID' });
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
        handleIdentifierSubmit,
        handleMethodSelection,
        handleResetChange,
        handleResetSubmit,
        handleResendOtp,
    };
};
