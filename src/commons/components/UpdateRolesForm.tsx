import { FaTrash } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Input from '../../commons/components/Input';
import type { RoleUpdationRequestExtended } from '../../admin/reducers/updateRolesReducer';

interface UpdateRolesFormProps {
    roles: RoleUpdationRequestExtended[];
    errors: Record<number, Record<string, string>>;
    updatedRoleNames: Set<string>;
    handleRemoveRole: (index: number) => void;
    handleRoleChange: (index: number, field: keyof RoleUpdationRequestExtended, value: any) => void;
    initialRoles?: RoleUpdationRequestExtended[];
    disableRoleNameEditing?: boolean;
}

const UpdateRolesForm = ({
    roles,
    errors,
    updatedRoleNames,
    handleRemoveRole,
    handleRoleChange,
    initialRoles,
    disableRoleNameEditing
}: UpdateRolesFormProps) => {
    return (
        <div className="space-y-6">
            {roles.map((role, index) => (
                <Card key={index} title={`Role ${index + 1}`} className={`relative ${updatedRoleNames.has(role.roleName)
                    ? '!border-2 !border-blue-500'
                    : ''
                    }`}>
                    {roles.length > 1 && (
                        <button
                            onClick={() => handleRemoveRole(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                            title="Remove Role"
                        >
                            <FaTrash />
                        </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                            label="Role Name"
                            value={role.roleName}
                            onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
                            required
                            error={errors[index]?.roleName}
                            placeholder="Role Name"
                            disabled={disableRoleNameEditing || (initialRoles && initialRoles.length > index && !!initialRoles[index]?.roleName)}
                        />
                        <Input
                            label="Description"
                            value={role.description || ''}
                            onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                            error={errors[index]?.description}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Permissions</label>
                        <textarea
                            value={role.permissionsInput || ''}
                            onChange={(e) => handleRoleChange(index, 'permissionsInput', e.target.value)}
                            placeholder="Type new permissions to REPLACE existing ones (space, comma, or new line separated). Leave empty to keep existing permissions."
                            className={`w-full h-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white sm:text-sm resize-y ${errors[index]?.permissions ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} ${role.clearPermissions ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={role.clearPermissions}
                        />
                        <div className="mt-2 flex items-center">
                            <input
                                type="checkbox"
                                id={`clear-permissions-${index}`}
                                checked={role.clearPermissions}
                                onChange={(e) => handleRoleChange(index, 'clearPermissions', e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`clear-permissions-${index}`} className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                                Clear all permissions
                            </label>
                        </div>
                        {errors[index]?.permissions && (
                            <p className="mt-1 text-sm text-red-500">{errors[index].permissions}</p>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default UpdateRolesForm; 
