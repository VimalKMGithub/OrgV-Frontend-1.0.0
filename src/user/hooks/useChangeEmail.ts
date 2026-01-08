import { useReducer, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { validateEmail, validateOtp, validatePassword } from '../../commons/utils/validationUtility';
import { emailChangeRequest, verifyEmailChange, type EmailChangeRequestResponse } from '../api/userApis';
import { initialChangeEmailState, changeEmailReducer } from '../reducers/changeEmailReducer';

export const useChangeEmail = () => {
    const [state, dispatch] = useReducer(changeEmailReducer, initialChangeEmailState);
    const { localLogout } = useAuth();
    const navigate = useNavigate();

    const handleRequestSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const emailError = validateEmail(state.newEmail);
        if (emailError) {
            dispatch({ type: 'SET_ERRORS', payload: { newEmail: emailError } });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: EmailChangeRequestResponse = await emailChangeRequest({
                newEmail: state.newEmail
            });
            toast.success(response.message);
            dispatch({ type: 'SET_STEP', payload: 'VERIFY' });
            dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: 300 });
            dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
            dispatch({ type: 'SET_ERRORS', payload: {} });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('email')) {
                    dispatch({ type: 'SET_ERRORS', payload: { newEmail: errorMessage } });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to request email change.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleVerifySubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        const oldOtpError = validateOtp(state.oldEmailOtp, 6);
        if (oldOtpError) {
            newErrors.oldEmailOtp = oldOtpError;
        }
        const newOtpError = validateOtp(state.newEmailOtp, 6);
        if (newOtpError) {
            newErrors.newEmailOtp = newOtpError;
        }
        const passwordError = validatePassword(state.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }
        if (Object.keys(newErrors).length > 0) {
            dispatch({ type: 'SET_ERRORS', payload: newErrors });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await verifyEmailChange({
                newEmailOtp: state.newEmailOtp,
                oldEmailOtp: state.oldEmailOtp,
                password: state.password
            });
            toast.success('Email changed successfully. Please login again.');
            localLogout();
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const newErrors: Record<string, string> = {};
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('password')) {
                    newErrors.password = errorMessage;
                } else {
                    toast.error(errorMessage);
                }
                if (Object.keys(newErrors).length > 0) {
                    dispatch({ type: 'SET_ERRORS', payload: newErrors });
                }
            } else {
                toast.error('Verification failed.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleResendOtp = async () => {
        if (state.resendCountdown > 0) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: EmailChangeRequestResponse = await emailChangeRequest({
                newEmail: state.newEmail
            });
            toast.success(response.message || 'Verification codes resent successfully.');
            dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to resend verification codes.');
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
        } else if (state.sessionCountdown === 0 && state.step === 'VERIFY') {
            toast.warning('Session expired. Please try again.');
            dispatch({ type: 'SET_STEP', payload: 'REQUEST' });
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
        handleRequestSubmit,
        handleVerifySubmit,
        handleResendOtp,
    };
};
