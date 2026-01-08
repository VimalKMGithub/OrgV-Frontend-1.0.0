import ErrorList from '../../commons/components/ErrorList';

interface DeleteUsersResultProps {
    result: any;
}

const DeleteUsersResult = ({
    result
}: DeleteUsersResultProps) => {
    if (!result) {
        return null;
    }
    return (
        <div className={`mt-6 p-4 rounded-md ${result.message?.includes('successfully') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Result</h3>
            <p className="text-slate-800 dark:text-slate-200 mb-2">{result.message}</p>
            <ErrorList errors={result.you_cannot_delete_your_own_account_using_this_endpoint} title="Self Deletion Attempt (Cannot delete own account using this endpoint)" />
            <ErrorList errors={result.users_not_found_with_usernames} title="Users Not Found (Usernames)" />
            <ErrorList errors={result.users_not_found_with_emails} title="Users Not Found (Emails)" />
            <ErrorList errors={result.users_not_found_with_ids} title="Users Not Found (IDs)" />
            <ErrorList errors={result.cannot_delete_users_having_roles_higher_or_equal_than_deleter_identifiers} title="Permission Denied (Some users have higher roles so you are not allowed to delete them)" />
        </div>
    );
};

export default DeleteUsersResult;
