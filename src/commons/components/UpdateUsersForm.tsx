import { FaTrash } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import type { UserUpdationRequestExtended } from '../../admin/reducers/updateUsersReducer';

interface UpdateUsersFormProps {
    users: UserUpdationRequestExtended[];
    errors: Record<number, Record<string, string>>;
    updatedUsernames: Set<string>;
    handleRemoveUser: (index: number) => void;
    handleUserChange: (index: number, field: keyof UserUpdationRequestExtended, value: any) => void;
    initialUsers?: UserUpdationRequestExtended[];
    disableOldUsernameEditing?: boolean;
}

const UpdateUsersForm = ({
    users,
    errors,
    updatedUsernames,
    handleRemoveUser,
    handleUserChange,
    initialUsers,
    disableOldUsernameEditing
}: UpdateUsersFormProps) => {
    return (
        <div className="space-y-6">
            {users.map((user, index) => (
                <Card key={index} title={`User ${index + 1}`} className={`relative ${updatedUsernames.has(user.oldUsername) || (user.username && updatedUsernames.has(user.username))
                    ? '!border-2 !border-blue-500'
                    : ''
                    }`}>
                    {users.length > 1 && (
                        <button
                            onClick={() => handleRemoveUser(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                            title="Remove User"
                        >
                            <FaTrash />
                        </button>
                    )}

                    <div className="mb-4">
                        <Input
                            label="Old Username"
                            value={user.oldUsername}
                            onChange={(e) => handleUserChange(index, 'oldUsername', e.target.value)}
                            required
                            error={errors[index]?.oldUsername}
                            placeholder="Old Username"
                            disabled={disableOldUsernameEditing || (initialUsers && initialUsers.length > index && !!initialUsers[index]?.oldUsername)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            label="Username"
                            value={user.username || ''}
                            onChange={(e) => handleUserChange(index, 'username', e.target.value)}
                            error={errors[index]?.username}
                            placeholder="Leave empty to keep current"
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={user.email || ''}
                            onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                            error={errors[index]?.email}
                            placeholder="Leave empty to keep current"
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={user.password || ''}
                            onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                            error={errors[index]?.password}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            label="First Name"
                            value={user.firstName || ''}
                            onChange={(e) => handleUserChange(index, 'firstName', e.target.value)}
                            error={errors[index]?.firstName}
                            placeholder="Leave empty to keep current"
                        />
                        <Input
                            label="Middle Name"
                            value={user.middleName || ''}
                            onChange={(e) => handleUserChange(index, 'middleName', e.target.value)}
                            error={errors[index]?.middleName}
                            placeholder="Leave empty to keep current"
                        />
                        <Input
                            label="Last Name"
                            value={user.lastName || ''}
                            onChange={(e) => handleUserChange(index, 'lastName', e.target.value)}
                            error={errors[index]?.lastName}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Roles</label>
                        <textarea
                            value={user.rolesInput || ''}
                            onChange={(e) => handleUserChange(index, 'rolesInput', e.target.value)}
                            placeholder="Type new roles to REPLACE existing ones (space, comma, or new line separated). Leave empty to keep existing roles."
                            className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white sm:text-sm resize-y ${errors[index]?.roles ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        />
                        <div className="mt-2 flex items-center">
                            <input
                                type="checkbox"
                                id={`clear-roles-${index}`}
                                checked={user.clearRoles}
                                onChange={(e) => handleUserChange(index, 'clearRoles', e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`clear-roles-${index}`} className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                                Clear all roles
                            </label>
                        </div>
                        {errors[index]?.roles && (
                            <p className="mt-1 text-sm text-red-500">{errors[index].roles}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                label="Allowed Concurrent Logins"
                                type="number"
                                value={user.allowedConcurrentLogins?.toString() || ''}
                                onChange={(e) => handleUserChange(index, 'allowedConcurrentLogins', parseInt(e.target.value) || 0)}
                                error={errors[index]?.allowedConcurrentLogins}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={user.emailVerified || false}
                                    onChange={(e) => handleUserChange(index, 'emailVerified', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Email Verified</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={user.accountEnabled || false}
                                    onChange={(e) => handleUserChange(index, 'accountEnabled', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Account Enabled</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={user.accountLocked || false}
                                    onChange={(e) => handleUserChange(index, 'accountLocked', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Account Locked</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={user.accountDeleted || false}
                                    onChange={(e) => handleUserChange(index, 'accountDeleted', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Account Deleted</span>
                            </label>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default UpdateUsersForm;
