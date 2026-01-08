import { FaShieldAlt, FaCalendarAlt, FaTrash, FaEdit } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import { dateToLocaleString } from '../../commons/utils/dateTimeUtility';
import type { RoleSummary } from '../../admin/api/adminApis';

interface RoleCardProps {
    role: RoleSummary;
    onDelete: (role: RoleSummary) => void;
    onUpdate: (role: RoleSummary) => void;
    isSelected: boolean;
    onSelect: (role: RoleSummary) => void;
    canDelete: boolean;
    canUpdate: boolean;
    canSelect: boolean;
}

const RoleCard = ({
    role,
    onDelete,
    onUpdate,
    isSelected,
    onSelect,
    canDelete,
    canUpdate,
    canSelect
}: RoleCardProps) => {
    return (
        <Card title={`${role.roleName}`} className="mb-4 border-l-4 border-primary relative pl-12">
            {canSelect && (
                <div className="absolute top-6 left-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(role)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                </div>
            )}

            {canUpdate && (
                <div className="absolute top-4 right-14">
                    <button
                        onClick={() => onUpdate(role)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Update Role"
                    >
                        <FaEdit />
                    </button>
                </div>
            )}

            {canDelete && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => onDelete(role)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete Role"
                    >
                        <FaTrash />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaShieldAlt className="mr-2" /> Details
                    </h4>
                    <p><span className="font-medium">Description:</span> {role.description || 'N/A'}</p>
                    <p><span className="font-medium">System Role:</span> <span className={`px-2 py-1 text-xs font-medium rounded-full ${role.systemRole ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>
                        {role.systemRole ? 'Yes' : 'No'}
                    </span></p>

                    {role.permissions && role.permissions.length > 0 && (
                        <div>
                            <span className="font-medium">Permissions:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {role.permissions.map((perm) => (
                                    <span key={perm.permissionName} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs border border-slate-200 dark:border-slate-600">
                                        {perm.permissionName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaCalendarAlt className="mr-2" /> Activity
                    </h4>
                    <div>
                        <p><span className="font-medium">Created At:</span> {dateToLocaleString(role.createdAt)}</p>
                        <p><span className="font-medium">Created By:</span> {role.createdBy}</p>
                    </div>
                    {role.updatedAt && (
                        <div>
                            <p><span className="font-medium">Last Updated At:</span> {dateToLocaleString(role.updatedAt)}</p>
                            <p><span className="font-medium">Updated By:</span> {role.updatedBy}</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default RoleCard;
