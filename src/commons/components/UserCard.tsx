import { FaUser, FaCalendarAlt, FaShieldAlt, FaTrash, FaEdit } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import { dateToLocaleString } from '../../commons/utils/dateTimeUtility';
import { extractUserAuthorities } from '../../commons/utils/authorityUtility';
import type { UserSummaryToCompanyUser } from '../../admin/api/adminApis';
import ExternalIdentitiesList from './ExternalIdentitiesList';

interface UserCardProps {
    user: UserSummaryToCompanyUser;
    onDelete: (user: UserSummaryToCompanyUser) => void;
    onUpdate: (user: UserSummaryToCompanyUser) => void;
    isSelected: boolean;
    onSelect: (user: UserSummaryToCompanyUser) => void;
    canDelete: boolean;
    canUpdate: boolean;
    canSelect: boolean;
}

const UserCard = ({
    user,
    onDelete,
    onUpdate,
    isSelected,
    onSelect,
    canDelete,
    canUpdate,
    canSelect
}: UserCardProps) => {
    const authorities = Array.from(extractUserAuthorities(user));
    return (
        <Card title={`${user.username}`} className="mb-4 border-l-4 border-primary relative pl-12">
            {canSelect && (
                <div className="absolute top-6 left-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(user)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                </div>
            )}

            {canUpdate && (
                <div className="absolute top-4 right-14">
                    <button
                        onClick={() => onUpdate(user)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Update User"
                    >
                        <FaEdit />
                    </button>
                </div>
            )}

            {canDelete && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => onDelete(user)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete User"
                    >
                        <FaTrash />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaUser className="mr-2" /> Identity
                    </h4>
                    <p><span className="font-medium">ID:</span> {user.id}</p>
                    <p><span className="font-medium">Full Name:</span> {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    {user.realEmail && user.realEmail !== user.email && (
                        <p><span className="font-medium">Real Email:</span> {user.realEmail}</p>
                    )}
                    <p><span className="font-medium">OAuth2 User:</span> <span className={`px-2 py-1 text-xs font-medium rounded-full ${user?.oauth2User ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {user?.oauth2User ? 'Yes' : 'No'}
                    </span></p>
                    {user.externalIdentities && user.externalIdentities.length > 0 && <ExternalIdentitiesList externalIdentities={user.externalIdentities} />}
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaShieldAlt className="mr-2" /> Status & Security
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.accountEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.accountEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${user.accountLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {user.accountLocked ? 'Locked' : 'Unlocked'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${user.mfaEnabled ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                            {user.mfaEnabled ? 'MFA Enabled' : 'MFA Disabled'}
                        </span>
                        {user.accountDeleted && (
                            <span className="px-2 py-1 rounded text-xs bg-red-200 text-red-900">Deleted</span>
                        )}
                    </div>

                    {authorities.length > 0 && (
                        <div>
                            <span className="font-medium">Authorities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {authorities.map((auth) => (
                                    <span key={auth} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs border border-slate-200 dark:border-slate-600">
                                        {auth}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {user?.mfaMethods && user.mfaMethods.length > 0 && (
                        <div>
                            <span className="font-medium">Mfa Methods:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.mfaMethods.map((method) => (
                                    <span key={method} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs border border-slate-200 dark:border-slate-600">
                                        {method.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-2">
                        <p><span className="font-medium">Failed Login Attempts:</span> {user.failedLoginAttempts}</p>
                        <p><span className="font-medium">Failed MFA Attempts:</span> {user.failedMfaAttempts}</p>
                    </div>
                    <p><span className="font-medium">Allowed Concurrent Logins:</span> {user.allowedConcurrentLogins}</p>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                        <FaCalendarAlt className="mr-2" /> Activity
                    </h4>
                    <div>
                        <p><span className="font-medium">Created At:</span> {dateToLocaleString(user.createdAt)}</p>
                        <p><span className="font-medium">Created By:</span> {user.createdBy}</p>
                    </div>
                    {user.updatedAt && (
                        <div>
                            <p><span className="font-medium">Last Updated At:</span> {dateToLocaleString(user.updatedAt)}</p>
                            <p><span className="font-medium">Updated By:</span> {user.updatedBy}</p>
                        </div>
                    )}
                    {user.lastLoginAt && <p><span className="font-medium">Last Login At:</span> {dateToLocaleString(user.lastLoginAt)}</p>}
                    <p><span className="font-medium">Password Changed At:</span> {dateToLocaleString(user.passwordChangedAt)}</p>
                    {user.lastLockedAt && <p><span className="font-medium text-red-500">Last Locked At:</span> {dateToLocaleString(user.lastLockedAt)}</p>}
                    {user.accountDeletedAt && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                            <p className="text-red-600 dark:text-red-400 font-semibold text-xs uppercase mb-1">Deletion Details</p>
                            <p><span className="font-medium">Deleted At:</span> {dateToLocaleString(user.accountDeletedAt)}</p>
                            <p><span className="font-medium">Deleted By:</span> {user.accountDeletedBy}</p>
                        </div>
                    )}
                    {user.accountRecoveredAt && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30">
                            <p className="text-green-600 dark:text-green-400 font-semibold text-xs uppercase mb-1">Recovery Details</p>
                            <p><span className="font-medium">Recovered At:</span> {dateToLocaleString(user.accountRecoveredAt)}</p>
                            <p><span className="font-medium">Recovered By:</span> {user.accountRecoveredBy}</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default UserCard;
