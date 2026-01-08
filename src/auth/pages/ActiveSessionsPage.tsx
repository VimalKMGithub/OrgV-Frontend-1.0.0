import {
    FaWindows,
    FaLinux,
    FaApple,
    FaAndroid,
    FaDesktop,
    FaChrome,
    FaFirefox,
    FaEdge,
    FaSafari,
    FaGlobe
} from 'react-icons/fa';
import Modal from '../../commons/components/Modal';
import Button from '../../commons/components/Button';
import Card from '../../commons/components/Card';
import PageHeader from '../../commons/components/PageHeader';
import LoadingSpinner from '../../commons/components/LoadingSpinner';
import { timestampToLocaleString } from '../../commons/utils/dateTimeUtility';
import { useActiveSessions } from '../hooks/useActiveSessions';
import { useCallback, useMemo } from 'react';

export interface Session {
    deviceId: string;
    deviceType: string;
    os: string;
    app: string;
    ip: string;
    lastLoginAt: number;
    isCurrent: boolean;
}

const ActiveSessionsPage = () => {
    const {
        state,
        dispatch,
        handleCheckboxChange,
        handleSelectAll,
        handleLogoutSelected,
        handleLogoutSession,
        handleLogoutAll,
        performLogoutSelected,
        performLogoutSession,
    } = useActiveSessions();

    const {
        sessions,
        selectedDevices,
        isLoading,
        isLoggingOut,
        isLogoutAllModalOpen,
        isLogoutSelectedModalOpen,
        isLogoutCurrentSessionModalOpen,
        sessionToLogout
    } = state;

    const getOsIcon = useCallback((os: string) => {
        const lower = os.toLowerCase();
        if (lower.includes('windows')) {
            return <FaWindows className="text-blue-500 text-2xl" />;
        }
        if (lower.includes('linux')) {
            return <FaLinux className="text-yellow-500 text-2xl" />;
        }
        if (lower.includes('mac') || lower.includes('ios')) {
            return <FaApple className="text-gray-800 dark:text-white text-2xl" />;
        }
        if (lower.includes('android')) {
            return <FaAndroid className="text-green-500 text-2xl" />;
        }
        return <FaDesktop className="text-gray-500 text-2xl" />;
    }, []);

    const getBrowserIcon = useCallback((app: string) => {
        const lower = app.toLowerCase();
        if (lower.includes('chrome')) {
            return <FaChrome className="text-blue-500" />;
        }
        if (lower.includes('firefox')) {
            return <FaFirefox className="text-orange-500" />;
        }
        if (lower.includes('edge')) {
            return <FaEdge className="text-blue-600" />;
        }
        if (lower.includes('safari')) {
            return <FaSafari className="text-blue-400" />;
        }
        return <FaGlobe className="text-gray-400" />;
    }, []);

    const isAllSelected = useMemo(() => {
        return sessions.length > 0 && selectedDevices.size === sessions.length;
    }, [sessions.length, selectedDevices.size]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PageHeader title="" backPath="/" backText="Back to Dashboard" />

            <Card title="Active Sessions">
                <div className="mb-6 flex justify-end gap-3">
                    {selectedDevices.size > 0 && (
                        <Button
                            variant="danger"
                            onClick={handleLogoutSelected}
                            isLoading={isLoggingOut}
                        >
                            Logout Selected ({selectedDevices.size})
                        </Button>
                    )}

                    <Button
                        variant="danger"
                        onClick={() =>
                            dispatch({ type: 'SET_LOGOUT_ALL_MODAL_OPEN', payload: true })
                        }
                        isLoading={isLoggingOut}
                    >
                        Logout All Devices
                    </Button>
                </div>

                {sessions.length > 0 && (
                    <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mr-4"
                            id="selectAll"
                        />
                        <label
                            htmlFor="selectAll"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                        >
                            Select All Devices
                        </label>
                    </div>
                )}

                <div className="space-y-4">
                    {sessions.map(session => (
                        <div
                            key={session.deviceId}
                            className={`flex items-center p-4 rounded-lg border ${session.isCurrent
                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                }`}
                        >
                            <div className="mr-4">
                                <input
                                    type="checkbox"
                                    checked={selectedDevices.has(session.deviceId)}
                                    onChange={() => handleCheckboxChange(session.deviceId)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>

                            <div className="mr-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                                {getOsIcon(session.os)}
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {session.os}
                                    </h3>

                                    {session.isCurrent && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                                            Current Device
                                        </span>
                                    )}
                                </div>

                                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                                    {getBrowserIcon(session.app)}
                                    <span>{session.app}</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span>{session.ip}</span>
                                </div>

                                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                    Active on: {timestampToLocaleString(session.lastLoginAt)}
                                </div>
                            </div>

                            <div className="ml-4">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        handleLogoutSession(session.deviceId, session.isCurrent)
                                    }
                                    disabled={isLoggingOut}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    ))}

                    {sessions.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No active sessions found.
                        </div>
                    )}
                </div>
            </Card>

            {isLogoutAllModalOpen && (
                <Modal
                    isOpen={isLogoutAllModalOpen}
                    onClose={() => dispatch({ type: 'SET_LOGOUT_ALL_MODAL_OPEN', payload: false })}
                    title="Logout All Devices"
                    footer={
                        <>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    dispatch({ type: 'SET_LOGOUT_ALL_MODAL_OPEN', payload: false })
                                }
                            >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleLogoutAll} isLoading={isLoggingOut}>
                                Logout All
                            </Button>
                        </>
                    }
                >
                    <p className="text-slate-600 dark:text-slate-300">
                        Are you sure you want to logout from <strong>ALL</strong> devices? This
                        includes your current device.
                    </p>
                </Modal>
            )}

            {isLogoutSelectedModalOpen && (
                <Modal
                    isOpen={isLogoutSelectedModalOpen}
                    onClose={() =>
                        dispatch({ type: 'SET_LOGOUT_SELECTED_MODAL_OPEN', payload: false })
                    }
                    title="Logout Selected Devices"
                    footer={
                        <>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    dispatch({
                                        type: 'SET_LOGOUT_SELECTED_MODAL_OPEN',
                                        payload: false
                                    })
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={performLogoutSelected}
                                isLoading={isLoggingOut}
                            >
                                Logout Selected
                            </Button>
                        </>
                    }
                >
                    <p className="text-slate-600 dark:text-slate-300">
                        You selected your <strong>current device</strong>. Logging out will end
                        your own session.
                    </p>
                </Modal>
            )}

            {isLogoutCurrentSessionModalOpen && sessionToLogout && (
                <Modal
                    isOpen={isLogoutCurrentSessionModalOpen}
                    onClose={() =>
                        dispatch({
                            type: 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN',
                            payload: false
                        })
                    }
                    title="Logout Current Device"
                    footer={
                        <>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    dispatch({
                                        type: 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN',
                                        payload: false
                                    })
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    performLogoutSession(
                                        sessionToLogout.deviceId,
                                        sessionToLogout.isCurrent
                                    )
                                }
                                isLoading={isLoggingOut}
                            >
                                Logout
                            </Button>
                        </>
                    }
                >
                    <p className="text-slate-600 dark:text-slate-300">
                        Logging out from your <strong>current device</strong> will end your
                        session immediately.
                    </p>
                </Modal>
            )}
        </div>
    );
};

export default ActiveSessionsPage;
