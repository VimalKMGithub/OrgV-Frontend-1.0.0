import { useNavigate } from 'react-router-dom';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import { useChangeEmail } from '../hooks/useChangeEmail';

const ChangeEmailPage = () => {
    const navigate = useNavigate();
    const {
        state,
        dispatch,
        handleRequestSubmit,
        handleVerifySubmit,
        handleResendOtp,
    } = useChangeEmail();

    const {
        isLoading,
        step,
        newEmail,
        oldEmailOtp,
        newEmailOtp,
        password,
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
            <Card title="Change Email" className="w-full max-w-md">
                {step === 'REQUEST' && (
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Enter your new email address. We will send verification codes to both your current email and the new one.
                        </p>
                        <Input
                            label="New Email Address"
                            type="email"
                            value={newEmail}
                            onChange={(e) => {
                                dispatch({ type: 'SET_NEW_EMAIL', payload: e.target.value });
                                if (errors.newEmail) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, newEmail: '' } });
                                }
                            }}
                            required
                            error={errors.newEmail}
                            placeholder="e.g. new.email@example.com"
                        />

                        <div className="flex space-x-3 pt-2">
                            <Button variant="outline" fullWidth onClick={() => navigate('/')} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" fullWidth isLoading={isLoading}>
                                Send Codes
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'VERIFY' && (
                    <form onSubmit={handleVerifySubmit} className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Please enter the verification codes sent to your emails and your current password to confirm.
                        </p>

                        {sessionCountdown > 0 && (
                            <div className="mb-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded">
                                Session expires in: {formatTime(sessionCountdown)}
                            </div>
                        )}

                        <Input
                            label="Code from OLD Email"
                            value={oldEmailOtp}
                            onChange={(e) => {
                                dispatch({ type: 'SET_OLD_EMAIL_OTP', payload: e.target.value });
                                if (errors.oldEmailOtp) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, oldEmailOtp: '' } });
                                }
                            }}
                            required
                            error={errors.oldEmailOtp}
                            placeholder="6-digit code"
                        />

                        <Input
                            label="Code from NEW Email"
                            value={newEmailOtp}
                            onChange={(e) => {
                                dispatch({ type: 'SET_NEW_EMAIL_OTP', payload: e.target.value });
                                if (errors.newEmailOtp) {
                                    dispatch({ type: 'SET_ERRORS', payload: { ...errors, newEmailOtp: '' } });
                                }
                            }}
                            required
                            error={errors.newEmailOtp}
                            placeholder="6-digit code"
                        />

                        <Input
                            label="Current Password"
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
                            placeholder="Verify your identity"
                        />

                        <div className="mt-2 text-center">
                            <button
                                type="button"
                                disabled={resendCountdown > 0 || isLoading}
                                onClick={handleResendOtp}
                                className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none"
                            >
                                {resendCountdown > 0 ? `Resend Codes (${resendCountdown}s)` : "Resend Codes"}
                            </button>
                        </div>

                        <div className="flex space-x-3 pt-2">
                            <Button variant="outline" fullWidth onClick={() => dispatch({ type: 'SET_STEP', payload: 'REQUEST' })} type="button">
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

export default ChangeEmailPage;
