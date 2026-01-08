import { FaEdit } from 'react-icons/fa';
import Card from '../../commons/components/Card';
import Button from '../../commons/components/Button';
import { dateToLocaleString } from '../../commons/utils/dateTimeUtility';
import ExternalIdentitiesList from '../../commons/components/ExternalIdentitiesList';
import { useDashboard } from '../hooks/useDashboard';

const DashboardPage = () => {
    const {
        state,
        user,
        authorities,
        handleLogout,
        navigate,
    } = useDashboard();

    const { isLoggingOut } = state;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Profile Information">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Username</label>
                                <p className="text-base font-medium text-slate-900 dark:text-white break-all" title={user?.username}>
                                    {user?.username}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</label>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-base font-medium text-slate-900 dark:text-white truncate" title={[user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(' ')}>
                                            {[user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(' ') || 'N/A'}
                                        </p>
                                        <button
                                            onClick={() => navigate('/update-profile')}
                                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 ml-2"
                                            title="Edit Profile"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
                            <div className="flex items-center space-x-2">
                                <p className="text-base font-medium text-slate-900 dark:text-white break-all">{user?.email}</p>
                                {user?.emailVerified && (
                                    <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                                        Verified
                                    </span>
                                )}
                                <button
                                    onClick={() => navigate('/change-email')}
                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 ml-2"
                                    title="Change Email"
                                >
                                    <FaEdit size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Mfa Status</label>
                                <div className="mt-1 space-y-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user?.mfaEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                        {user?.mfaEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {user?.mfaMethods && user.mfaMethods.length > 0 && (
                                    <>
                                        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Mfa Methods</label>
                                        <div className="flex flex-wrap gap-1">
                                            {user.mfaMethods.map((method) => (
                                                <span key={method} className="px-2 py-0.5 text-xs border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-400">
                                                    {method.replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {user?.lastLoginAt && (
                                <div>
                                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Login At</label>
                                    <p className="text-sm text-slate-900 dark:text-white">
                                        {dateToLocaleString(user.lastLoginAt)}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">User Id</label>
                                <p className="text-base font-medium text-slate-900 dark:text-white break-all">{user?.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {authorities.size > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Authorities</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {Array.from(authorities).map((auth) => (
                                            <span key={auth} className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                                {auth}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30">
                                    <p className="text-green-600 dark:text-green-400 font-semibold text-xs uppercase mb-1">Creation Details</p>
                                    <p><span className="font-medium">Created At:</span> {dateToLocaleString(user?.createdAt)}</p>
                                    <p><span className="font-medium">Created By:</span> {user?.createdBy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {user?.updatedAt && (
                                <div>
                                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-900/30">
                                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase mb-1">Updation Details</p>
                                        <p><span className="font-medium">Updated At:</span> {dateToLocaleString(user?.updatedAt)}</p>
                                        <p><span className="font-medium">Updated By:</span> {user?.updatedBy}</p>
                                    </div>
                                </div>
                            )}
                            {user?.passwordChangedAt && (
                                <div>
                                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Password Changed At</label>
                                    <p className="text-base font-medium text-slate-900 dark:text-white break-all">{dateToLocaleString(user?.passwordChangedAt)}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {user?.lastLockedAt && (
                                <div>
                                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Locked At</label>
                                    <p className="text-base font-medium text-slate-900 dark:text-white break-all">{dateToLocaleString(user?.lastLockedAt)}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Allowed Concurrent Logins</label>
                                <p className="text-base font-medium text-slate-900 dark:text-white break-all">{user?.allowedConcurrentLogins}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">OAuth2 User</label>
                            <div className="mt-1 space-y-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user?.oauth2User ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                    {user?.oauth2User ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {user?.externalIdentities && user?.externalIdentities.length > 0 && <ExternalIdentitiesList externalIdentities={user.externalIdentities} />}
                        </div>
                    </div>
                </Card>

                <Card title="Quick Actions">
                    <div className="space-y-4">
                        <Button variant="outline" fullWidth onClick={() => navigate('/change-password')}>
                            Change Password
                        </Button>
                        <Button variant="outline" fullWidth onClick={() => navigate('/mfa-settings')}>
                            MFA Settings
                        </Button>
                        <Button variant="outline" fullWidth onClick={() => navigate('/active-sessions')}>
                            Manage Active Sessions
                        </Button>
                        {authorities.size > 0 && (
                            <Button variant="outline" fullWidth onClick={() => navigate('/admin')}>
                                Admin Panel
                            </Button>
                        )}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button variant="danger" fullWidth onClick={() => navigate('/delete-account')} className="mb-3">
                                Delete Account
                            </Button>
                            <Button variant="outline" fullWidth onClick={handleLogout} isLoading={isLoggingOut}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
