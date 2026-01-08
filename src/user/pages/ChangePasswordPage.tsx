import { useNavigate } from 'react-router-dom';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import MfaMethodSelector from '../../commons/components/MfaMethodSelector';
import { useChangePassword } from '../hooks/useChangePassword';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const {
        state,
        dispatch,
        handlePasswordSubmit,
        handleMethodSelection,
        handleVerifyMfa,
        handleResendOtp,
    } = useChangePassword();

    const {
        isLoading,
        step,
        oldPassword,
        newPassword,
        confirmNewPassword,
        errors,
        mfaMethods,
        selectedMethod,
        loadingMethod,
        otp,
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
            <Card title="Change Password" className="w-full max-w-md">
                {step === 'INPUT_PASSWORDS' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input
                            label="Old Password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => {
                                dispatch({ type: 'SET_OLD_PASSWORD', payload: e.target.value });
                                if (errors.oldPassword) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, oldPassword: '' } });
                                }
                            }}
                            required
                            error={errors.oldPassword}
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                dispatch({ type: 'SET_NEW_PASSWORD', payload: e.target.value });
                                if (errors.newPassword) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, newPassword: '' } });
                                }
                            }}
                            required
                            error={errors.newPassword}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => {
                                dispatch({ type: 'SET_CONFIRM_NEW_PASSWORD', payload: e.target.value });
                                if (errors.confirmNewPassword) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, confirmNewPassword: '' } });
                                }
                            }}
                            required
                            error={errors.confirmNewPassword}
                        />

                        <div className="flex space-x-3 pt-2">
                            <Button variant="outline" fullWidth onClick={() => navigate('/')} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Change Password
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'SELECT_MFA' && (
                    <div className="space-y-4">
                        <MfaMethodSelector
                            methods={mfaMethods}
                            onSelect={handleMethodSelection}
                            loadingMethod={loadingMethod}
                        />
                        <div className="mt-4 text-center">
                            <Button variant="outline" fullWidth onClick={() => dispatch({ type: 'SET_STEP', payload: 'INPUT_PASSWORDS' })}>
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'VERIFY_MFA' && (
                    <form onSubmit={handleVerifyMfa} className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                            Enter the 6-digit code sent to your {selectedMethod === 'EMAIL_MFA' ? 'email' : 'authenticator app'}.
                        </p>

                        {sessionCountdown > 0 && (
                            <div className="mb-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded">
                                Session expires in: {formatTime(sessionCountdown)}
                            </div>
                        )}
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

                        <div className="flex space-x-3">
                            <Button variant="outline" fullWidth onClick={() => {
                                dispatch({ type: 'SET_STEP', payload: 'SELECT_MFA' });
                                dispatch({ type: 'SET_OTP', payload: '' });
                                dispatch({ type: 'SET_ERRORS', payload: {} });
                            }} type="button">
                                Back
                            </Button>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Verify
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
