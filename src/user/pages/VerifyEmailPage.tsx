import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import PageHeader from '../../commons/components/PageHeader';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

const VerifyEmailPage = () => {
    const { state } = useVerifyEmail();
    const { status, message } = state;

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title="Email Verification" className="w-full max-w-md text-center">
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    {status === 'loading' && (
                        <>
                            <FaSpinner className="text-4xl text-primary animate-spin" />
                            <p className="text-slate-600 dark:text-slate-400">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <FaCheckCircle className="text-5xl text-green-500" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Verified!</h3>
                            <p className="text-slate-600 dark:text-slate-400">{message}</p>
                            <div className="mt-6 text-center">
                                <PageHeader title="" backPath="/login" backText="Go to Login" />
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <FaTimesCircle className="text-5xl text-red-500" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Verification Failed</h3>
                            <p className="text-slate-600 dark:text-slate-400">{message}</p>
                            <div className="mt-6 text-center">
                                <PageHeader title="" backPath="/login" backText="Go to Login" />
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default VerifyEmailPage;
