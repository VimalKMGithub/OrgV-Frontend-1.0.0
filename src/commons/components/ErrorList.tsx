interface ErrorListProps {
    errors: any;
    title: string;
}

const ErrorList = ({
    errors,
    title
}: ErrorListProps) => {
    if (!errors || (Array.isArray(errors) && errors.length === 0) || (typeof errors === 'object' && Object.keys(errors).length === 0)) {
        return null;
    }
    return (
        <div className="mt-2">
            <p className="font-semibold text-red-600 dark:text-red-400">{title}:</p>
            <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 ml-2">
                {Array.isArray(errors) ? (
                    errors.map((err: string, i: number) => <li key={i}>{err}</li>)
                ) : (
                    Object.entries(errors).map(([key, value]: [string, any]) => (
                        <li key={key}>
                            <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ErrorList;
