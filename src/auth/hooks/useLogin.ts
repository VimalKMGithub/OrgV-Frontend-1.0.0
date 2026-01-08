import { useReducer, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login as loginApi, requestMfaLogin, verifyMfaLogin, type LoginResponse, type RequestMfaLoginResponse } from '../api/authApis';
import { useAuth } from '../../commons/contexts/AuthContext';
import { validateOtp, validatePassword, validateUserIdentifier } from '../../commons/utils/validationUtility';
import { initialLoginState, loginReducer } from '../reducers/loginReducer';

export const useLogin = () => {
    const [state, dispatch] = useReducer(loginReducer, initialLoginState);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const usernameError = validateUserIdentifier(state.username);
        if (usernameError) {
            newErrors.username = usernameError;
        }
        const passwordError = validatePassword(state.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: LoginResponse = await loginApi({
                usernameOrEmailOrId: state.username,
                password: state.password,
            });
            if (response.mfa_methods && response.state_token) {
                dispatch({ type: 'SET_MFA_METHODS', payload: response.mfa_methods });
                dispatch({ type: 'SET_STATE_TOKEN', payload: response.state_token });
                dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: 300 });
                dispatch({ type: 'SET_STEP', payload: 'MFA_SELECTION' });
                toast.info(response.message);
            } else {
                await login();
                toast.success('Login successful!');
                navigate('/');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const newErrors: Record<string, string> = {};
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('user')) {
                    newErrors.username = errorMessage;
                } else {
                    toast.error(errorMessage);
                }
                if (Object.keys(newErrors).length > 0) {
                    dispatch({ type: 'SET_ERRORS', payload: newErrors });
                }
            } else {
                toast.error('Login failed.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleMfaMethodSelection = async (method: string) => {
        dispatch({ type: 'SET_LOADING_METHOD', payload: method });
        try {
            const response: RequestMfaLoginResponse = await requestMfaLogin({
                type: method,
                stateToken: state.stateToken
            });
            dispatch({ type: 'SET_SELECTED_METHOD', payload: method });
            dispatch({ type: 'SET_STEP', payload: 'MFA_VERIFICATION' });
            if (method === 'EMAIL_MFA') {
                dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
            }
            toast.success(response.message);
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message);
            } else {
                toast.error('Failed to select MFA method.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
        }
    };

    const handleResendOtp = async () => {
        if (state.resendCountdown > 0) {
            return;
        }
        dispatch({ type: 'SET_LOADING_METHOD', payload: 'EMAIL_MFA' });
        try {
            const response: RequestMfaLoginResponse = await requestMfaLogin({
                type: 'EMAIL_MFA',
                stateToken: state.stateToken
            });
            toast.success(response.message || 'OTP resent successfully');
            dispatch({ type: 'SET_RESEND_COUNTDOWN', payload: 60 });
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message);
            } else {
                toast.error('Failed to resend OTP.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING_METHOD', payload: null });
        }
    };

    const handleMfaVerification = async (e: FormEvent) => {
        e.preventDefault();
        const otpError = validateOtp(state.otp, 6);
        if (otpError) {
            dispatch({ type: 'SET_ERRORS', payload: { otp: otpError } });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await verifyMfaLogin({
                type: state.selectedMethod,
                stateToken: state.stateToken,
                otpTotp: state.otp
            });
            await login();
            toast.success('Login successful!');
            navigate('/');
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

    const handleSocialLogin = (provider: 'google' | 'github') => {
        dispatch({ type: 'SET_LOADING_SOCIAL', payload: true });
        if (provider === 'google') {
            dispatch({ type: 'SET_SELECTED_SOCIAL_LOGIN', payload: 'GOOGLE' });
        } else if (provider === 'github') {
            dispatch({ type: 'SET_SELECTED_SOCIAL_LOGIN', payload: 'GITHUB' });
        }
        document.cookie = `X-Device-Id=${localStorage.getItem('deviceId')}; path=/; max-age=300; SameSite=Lax`;
        const frontendRedirectUri = `${window.location.origin}/oauth2/callback`;
        window.location.href = `${import.meta.env.VITE_API_URL}/auth-service/oauth2/authorization/${provider}?frontend_redirect_uri=${encodeURIComponent(frontendRedirectUri)}`;
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (state.sessionCountdown > 0) {
            timer = setInterval(() => {
                dispatch({ type: 'SET_SESSION_COUNTDOWN', payload: state.sessionCountdown - 1 });
            }, 1000);
        } else if (state.sessionCountdown === 0 && state.stateToken) {
            toast.warning('Session expired. Please login again.');
            dispatch({ type: 'RESET' });
        }
        return () => clearInterval(timer);
    }, [state.sessionCountdown, state.stateToken]);

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
        handleLoginSubmit,
        handleMfaMethodSelection,
        handleMfaVerification,
        handleSocialLogin,
        handleResendOtp,
    };
};
