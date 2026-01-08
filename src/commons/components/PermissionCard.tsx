import { FaCalendarAlt } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import { dateToLocaleString } from '../../commons/utils/dateTimeUtility';
import type { Permission } from '../../user/api/userApis';

interface PermissionCardProps {
    permission: Permission;
}

const PermissionCard = ({
    permission
}: PermissionCardProps) => {
    return (
        <Card title={`${permission.permissionName}`} className="mb-4 border-l-4 border-primary relative pl-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaCalendarAlt className="mr-2" /> Activity
                    </h4>
                    <div>
                        <p><span className="font-medium">Created At:</span> {dateToLocaleString(permission.createdAt)}</p>
                        <p><span className="font-medium">Created By:</span> {permission.createdBy}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PermissionCard;
