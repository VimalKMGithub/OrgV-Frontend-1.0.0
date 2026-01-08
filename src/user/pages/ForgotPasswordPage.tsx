import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import MfaMethodSelector from '../../commons/components/MfaMethodSelector';
import PageHeader from '../../commons/components/PageHeader';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgotPasswordPage = () => {
    const {
        state,
        dispatch,
        handleIdentifierSubmit,
        handleMethodSelection,
        handleResetChange,
        handleResetSubmit,
        handleResendOtp,
    } = useForgotPassword();

    const {
        identifier,
        step,
        methods,
        isLoading,
        error,
        loadingMethod,
        resetFormData,
        resetErrors,
        sessionCountdown,
        selectedMethod,
        resendCountdown
    } = state;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title={step === 'RESET_PASSWORD' ? "Reset Password" : "Forgot Password"} className="w-full max-w-md">
                {step === 'INPUT_ID' && (
                    <>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
                            Enter your username, email, or ID to reset your password.
                        </p>
                        <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                            <Input
                                label="Username, Email, or ID"
                                value={identifier}
                                onChange={(e) => {
                                    dispatch({ type: 'SET_IDENTIFIER', payload: e.target.value });
                                    dispatch({ type: 'SET_ERROR', payload: '' });
                                }}
                                placeholder="Enter your identifier"
                                required
                                error={error}
                            />

                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Next
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <PageHeader title="" backPath="/login" backText="Back to Login" />
                        </div>
                    </>
                )}

                {step === 'SELECT_METHOD' && (
                    <>
                        <MfaMethodSelector
                            methods={methods}
                            onSelect={handleMethodSelection}
                            loadingMethod={loadingMethod}
                        />

                        <div className="mt-4">
                            <Button variant="outline" fullWidth onClick={() => dispatch({ type: 'SET_STEP', payload: 'INPUT_ID' })} type="button">
                                Back
                            </Button>
                        </div>
                    </>
                )}

                {step === 'RESET_PASSWORD' && (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        {sessionCountdown > 0 && (
                            <div className="mb-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded">
                                Session expires in: {formatTime(sessionCountdown)}
                            </div>
                        )}

                        <Input
                            label="OTP / Verification Code"
                            name="otpTotp"
                            value={resetFormData.otpTotp}
                            onChange={handleResetChange}
                            placeholder="Enter the code sent to you"
                            required
                            error={resetErrors?.otpTotp}
                        />
                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={resetFormData.newPassword}
                            onChange={handleResetChange}
                            placeholder="Enter new password"
                            required
                            error={resetErrors?.newPassword}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="confirmNewPassword"
                            value={resetFormData.confirmNewPassword}
                            onChange={handleResetChange}
                            placeholder="Confirm new password"
                            required
                            error={resetErrors?.confirmNewPassword}
                        />

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Reset Password
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

                        <div className="mt-4">
                            <Button variant="outline" fullWidth onClick={() => {
                                dispatch({ type: 'SET_STEP', payload: 'SELECT_METHOD' });
                                dispatch({ type: 'SET_LOADING_METHOD', payload: null });
                            }} type="button">
                                Back to Method Selection
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
