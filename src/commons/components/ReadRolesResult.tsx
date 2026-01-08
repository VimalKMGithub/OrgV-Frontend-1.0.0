import ErrorList from '../../commons/components/ErrorList';

interface ReadRolesResultProps {
    result: any;
}

const ReadRolesResult = ({
    result
}: ReadRolesResultProps) => {
    if (!result) {
        return null;
    }
    return (
        <div className={`mt-6 p-4 rounded-md ${result.found_roles && result.found_roles.length > 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Result</h3>
            {result.message && <p className="text-slate-800 dark:text-slate-200 mb-2">{result.message}</p>}
            <ErrorList errors={result.roles_not_found} title="Roles Not Found" />
        </div>
    );
};

export default ReadRolesResult;
