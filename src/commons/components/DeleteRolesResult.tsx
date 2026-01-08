import ErrorList from './ErrorList';

interface DeleteRolesResultProps {
    result: any;
}

const DeleteRolesResult = ({
    result
}: DeleteRolesResultProps) => {
    if (!result) {
        return null;
    }
    return (
        <div className={`mt-6 p-4 rounded-md ${result.message?.includes('successfully') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Result</h3>
            <p className="text-slate-800 dark:text-slate-200 mb-2">{result.message}</p>
            <ErrorList errors={result.roles_not_found} title="Roles Not Found" />
            <ErrorList errors={result.system_roles_cannot_be_deleted} title="System Roles (Cannot Delete)" />
            <ErrorList errors={result.roles_assigned_to_users} title="Roles Assigned to Users" />
        </div>
    );
};

export default DeleteRolesResult;
