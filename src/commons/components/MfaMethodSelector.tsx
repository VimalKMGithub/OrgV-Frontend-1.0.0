import { FaEnvelope, FaMobileAlt } from 'react-icons/fa';

interface MfaMethodSelectorProps {
    methods: string[];
    onSelect: (method: string) => void;
    loadingMethod: string | boolean | null;
}

const MfaMethodSelector = ({
    methods,
    onSelect,
    loadingMethod
}: MfaMethodSelectorProps) => {
    return (
        <>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                Your account has multi-factor authentication enabled. Please select a method to verify your identity.
            </p>
            <div className="space-y-3">
                {methods.map((method) => (
                    <div
                        key={method}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${loadingMethod === method
                            ? 'border-primary bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        onClick={() => !loadingMethod && onSelect(method)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${method === 'EMAIL_MFA'
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                                }`}>
                                {method === 'EMAIL_MFA' ? <FaEnvelope /> : <FaMobileAlt />}
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-white">
                                    {method === 'EMAIL_MFA' ? 'Email Authentication' : 'Authenticator App'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {method === 'EMAIL_MFA'
                                        ? 'Receive a code via email.'
                                        : 'Use your authenticator app.'}
                                </p>
                            </div>
                        </div>
                        {loadingMethod === method && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MfaMethodSelector;
