import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import MfaMethodSelector from '../../commons/components/MfaMethodSelector';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
    const {
        state,
        dispatch,
        handleLoginSubmit,
        handleMfaMethodSelection,
        handleMfaVerification,
        handleSocialLogin,
        handleResendOtp,
    } = useLogin();

    const {
        username,
        password,
        errors,
        isLoading,
        isLoadingSocial,
        selectedSocialLogin,
        step,
        mfaMethods,
        selectedMethod,
        otp,
        loadingMethod,
        sessionCountdown,
        resendCountdown,
    } = state;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title={step === 'LOGIN' ? "Welcome Back" : step === 'MFA_SELECTION' ? "Select Authentication Method" : "Two-Factor Authentication"} className="w-full max-w-md">
                {step !== 'LOGIN' && sessionCountdown > 0 && (
                    <div className="mb-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded">
                        Session expires in: {formatTime(sessionCountdown)}
                    </div>
                )}

                {step === 'LOGIN' && (
                    <>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <Input
                                label="Username, Email, or ID"
                                value={username}
                                onChange={(e) => {
                                    dispatch({ type: 'SET_USERNAME', payload: e.target.value });
                                    if (errors.username) {
                                        dispatch({ type: 'SET_ERRORS', payload: { ...errors, username: '' } });
                                    }
                                }}
                                placeholder="Enter your identifier"
                                required
                                error={errors.username}
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
                                    if (errors.password) {
                                        dispatch({ type: 'SET_ERRORS', payload: { ...errors, password: '' } });
                                    }
                                }}
                                placeholder="Enter your password"
                                required
                                error={errors.password}
                            />

                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Login
                            </Button>
                        </form>

                        <div className="mt-4 text-center">
                            <Link to="/resend-verification" className="text-sm text-primary hover:underline">
                                Resend Verification Email
                            </Link>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Button variant="outline" isLoading={isLoadingSocial && selectedSocialLogin === 'GOOGLE'} onClick={() => handleSocialLogin('google')} className="flex items-center justify-center">
                                    <FaGoogle className="mr-2" /> Google
                                </Button>
                                <Button variant="outline" isLoading={isLoadingSocial && selectedSocialLogin === 'GITHUB'} onClick={() => handleSocialLogin('github')} className="flex items-center justify-center">
                                    <FaGithub className="mr-2" /> GitHub
                                </Button>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:text-indigo-500">
                                Register
                            </Link>
                        </p>
                    </>
                )}

                {step === 'MFA_SELECTION' && (
                    <div className="space-y-4">
                        <MfaMethodSelector
                            methods={mfaMethods}
                            onSelect={handleMfaMethodSelection}
                            loadingMethod={loadingMethod}
                        />
                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                onClick={() => dispatch({ type: 'RESET' })}
                                fullWidth
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'MFA_VERIFICATION' && (
                    <form onSubmit={handleMfaVerification} className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                            Enter the 6-digit code sent to your {selectedMethod === 'EMAIL_MFA' ? 'email' : 'authenticator app'}.
                        </p>
                        <Input
                            label="Verification Code"
                            value={otp}
                            onChange={(e) => {
                                dispatch({ type: 'SET_OTP', payload: e.target.value });
                                dispatch({ type: 'SET_ERRORS', payload: { ...errors, otp: '' } });
                            }}
                            placeholder="Enter 6-digit code"
                            required
                            error={errors.otp}
                        />
                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Verify
                        </Button>

                        {selectedMethod === 'EMAIL_MFA' && (
                            <div className="mt-2 text-center">
                                <button
                                    type="button"
                                    disabled={resendCountdown > 0 || isLoading}
                                    onClick={handleResendOtp}
                                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none"
                                >
                                    {resendCountdown > 0 ? `Resend Code (${resendCountdown}s)` : "Resend Code"}
                                </button>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    dispatch({ type: 'RESET_MFA' });
                                }}
                                fullWidth
                            >
                                Back to Method Selection
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default LoginPage;
