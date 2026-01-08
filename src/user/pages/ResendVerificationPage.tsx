import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import Button from '../../commons/components/Button';
import PageHeader from '../../commons/components/PageHeader';
import { useResendVerification } from '../hooks/useResendVerification';

const ResendVerificationPage = () => {
    const {
        state,
        dispatch,
        handleSubmit,
    } = useResendVerification();

    const {
        identifier,
        error,
        isLoading,
    } = state;

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card title="Resend Verification Email" className="w-full max-w-md">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
                    Enter your username, email, or ID to receive a new verification link.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        Resend Link
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <PageHeader title="" backPath="/login" backText="Back to Login" />
                </div>
            </Card>
        </div>
    );
};

export default ResendVerificationPage;
