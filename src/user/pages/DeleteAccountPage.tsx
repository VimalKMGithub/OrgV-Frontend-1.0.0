import { FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import MfaMethodSelector from '../../commons/components/MfaMethodSelector';
import { useDeleteAccount } from '../hooks/useDeleteAccount';

const DeleteAccountPage = () => {
    const {
        state,
        dispatch,
        handlePasswordSubmit,
        handleMethodSelection,
        handleVerifySubmit,
        handleResendOtp,
        navigate,
    } = useDeleteAccount();

    const {
        isLoading,
        step,
        password,
        mfaMethods,
        selectedMethod,
        otp,
        errors,
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
            <Card title="Delete Account" className="w-full max-w-md border-red-200 dark:border-red-900">
                <div className="flex flex-col items-center mb-6 text-center">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3 dark:bg-red-900/30 dark:text-red-400">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        This action is permanent and cannot be undone. All your data will be wiped.
                    </p>
                </div>

                {step === 'PASSWORD' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
                                if (errors.password) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, password: '' } });
                                }
                            }}
                            required
                            error={errors.password}
                            placeholder="Enter your password to continue"
                        />

                        <div className="flex space-x-3 pt-2">
                            <Button variant="outline" fullWidth onClick={() => navigate('/')} type="button">
                                Cancel
                            </Button>
                            <Button variant="danger" type="submit" fullWidth isLoading={isLoading}>
                                Delete Account
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'SELECT_MFA' && (
                    <div className="space-y-4">
                        <MfaMethodSelector
                            methods={mfaMethods}
                            onSelect={handleMethodSelection}
                            loadingMethod={isLoading ? selectedMethod : null}
                        />
                        <Button variant="outline" fullWidth onClick={() => dispatch({ type: 'SET_STEP', payload: 'PASSWORD' })} className="mt-4">
                            Back
                        </Button>
                    </div>
                )}

                {step === 'VERIFY_MFA' && (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Enter the code sent to your {selectedMethod === 'EMAIL_MFA' ? 'email' : 'authenticator app'}.
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
                                if (errors.otp) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, otp: '' } });
                                }
                            }}
                            required
                            error={errors.otp}
                            placeholder="6-digit code"
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

                        <div className="flex space-x-3 pt-2">
                            <Button variant="outline" fullWidth onClick={() => dispatch({ type: 'SET_STEP', payload: 'SELECT_MFA' })} type="button">
                                Back
                            </Button>
                            <Button variant="danger" type="submit" fullWidth isLoading={isLoading}>
                                Verify
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default DeleteAccountPage;
