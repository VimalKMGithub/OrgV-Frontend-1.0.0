import { FaEnvelope, FaMobileAlt } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Button from '../../commons/components/Button';
import Input from '../../commons/components/Input';
import PageHeader from '../../commons/components/PageHeader';
import { useMfaSettings } from '../hooks/useMfaSettings';

const MfaSettingsPage = () => {
    const {
        state,
        dispatch,
        hasEmailMfa,
        hasAuthAppMfa,
        handleToggleRequest,
        handleVerify,
        cancelToggle,
        handleResendOtp,
    } = useMfaSettings();

    const {
        isLoading,
        activeMethod,
        isEnabling,
        step,
        qrCodeUrl,
        otp,
        error,
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
            <Card title="MFA Settings" className="w-full max-w-lg">
                {step === 'VERIFY' && sessionCountdown > 0 && (
                    <div className="mb-4 text-center text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-2 rounded">
                        Session expires in: {formatTime(sessionCountdown)}
                    </div>
                )}

                {step === 'LIST' && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Manage your Multi-Factor Authentication methods to enhance your account security.
                        </p>

                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-white">Email Authentication</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Receive a code via email to verify your identity.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-3 text-xs font-medium px-2 py-1 rounded-full ${hasEmailMfa ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                    {hasEmailMfa ? 'Enabled' : 'Disabled'}
                                </span>
                                <Button
                                    size="sm"
                                    variant={hasEmailMfa ? 'danger' : 'primary'}
                                    onClick={() => handleToggleRequest('EMAIL_MFA', !hasEmailMfa)}
                                    isLoading={isLoading && activeMethod === 'EMAIL_MFA'}
                                    disabled={isLoading}
                                >
                                    {hasEmailMfa ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900 dark:text-purple-200">
                                    <FaMobileAlt />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900 dark:text-white">Authenticator App</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Use an app like Google Authenticator or Authy.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-3 text-xs font-medium px-2 py-1 rounded-full ${hasAuthAppMfa ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                    {hasAuthAppMfa ? 'Enabled' : 'Disabled'}
                                </span>
                                <Button
                                    size="sm"
                                    variant={hasAuthAppMfa ? 'danger' : 'primary'}
                                    onClick={() => handleToggleRequest('AUTHENTICATOR_APP_MFA', !hasAuthAppMfa)}
                                    isLoading={isLoading && activeMethod === 'AUTHENTICATOR_APP_MFA'}
                                    disabled={isLoading}
                                >
                                    {hasAuthAppMfa ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </div>
                        <PageHeader title="" backPath="/" backText="Back to Dashboard" />
                    </div>
                )}

                {step === 'VERIFY' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                {isEnabling ? 'Enable' : 'Disable'} {activeMethod === 'EMAIL_MFA' ? 'Email Authentication' : 'Authenticator App'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                {qrCodeUrl
                                    ? 'Scan the QR code below with your Authenticator App, then enter the generated code.'
                                    : `Enter the verification code sent to your ${activeMethod === 'EMAIL_MFA' ? 'email' : 'authenticator app'} to confirm.`
                                }
                            </p>
                        </div>

                        {qrCodeUrl && (
                            <div className="flex justify-center my-4">
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                                    <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-4">
                            <Input
                                label="Verification Code"
                                value={otp}
                                onChange={(e) => {
                                    dispatch({ type: 'SET_OTP', payload: e.target.value });
                                    dispatch({ type: 'SET_ERROR', payload: '' });
                                }}
                                placeholder="Enter 6-digit code"
                                required
                                error={error}
                            />

                            <div className="flex space-x-3">
                                <Button variant="outline" fullWidth onClick={cancelToggle} type="button">
                                    Cancel
                                </Button>
                                <Button type="submit" fullWidth isLoading={isLoading}>
                                    {isEnabling ? 'Enable' : 'Disable'}
                                </Button>
                            </div>

                            {activeMethod === 'EMAIL_MFA' && (
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
                        </form>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MfaSettingsPage;
