import { useReducer, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import {
    getActiveDevices,
    logoutAllDevices,
    logoutFromDevices,
    type ActiveDevicesResponse
} from '../api/authApis';
import {
    initialActiveSessionsState,
    activeSessionsReducer
} from '../reducers/activeSessionsReducer';
import type { Session } from '../pages/ActiveSessionsPage';
import { useAuth } from '../../commons/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useActiveSessions = () => {
    const [state, dispatch] = useReducer(activeSessionsReducer, initialActiveSessionsState);
    const abortRef = useRef<AbortController | null>(null);
    const { localLogout } = useAuth();
    const navigate = useNavigate();

    const fetchSessions = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data: ActiveDevicesResponse = await getActiveDevices();
            const currentDeviceId = data.current_device_id;
            const parsedSessions: Session[] = Object.entries(data)
                .filter(([key]) => key !== 'current_device_id')
                .map(([key, value]) => {
                    const parts = (value as string).split(';');
                    return {
                        deviceId: key,
                        deviceType: parts[0] || 'Unknown',
                        os: parts[1] || 'Unknown',
                        app: parts[2] || 'Unknown',
                        ip: parts[3] || 'Unknown',
                        lastLoginAt: parseInt(parts[4] || '0', 10),
                        isCurrent: key === currentDeviceId
                    };
                })
                .sort((a, b) => b.lastLoginAt - a.lastLoginAt);

            if (!controller.signal.aborted) {
                dispatch({ type: 'SET_SESSIONS', payload: parsedSessions });
            }
        } catch (error: any) {
            if (error?.name !== 'AbortError') {
                toast.error(error?.response?.data?.message || 'Failed to load active sessions');
            }
        } finally {
            if (!abortRef.current?.signal.aborted) {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    }, []);

    useEffect(() => {
        fetchSessions();
        return () => abortRef.current?.abort();
    }, [fetchSessions]);

    const handleCheckboxChange = useCallback(
        (deviceId: string) => {
            const newSet = new Set(state.selectedDevices);
            if (newSet.has(deviceId)) {
                newSet.delete(deviceId);
            }
            else {
                newSet.add(deviceId);
            }
            dispatch({ type: 'SET_SELECTED_DEVICES', payload: newSet });
        },
        [state.selectedDevices]
    );

    const handleSelectAll = useCallback(() => {
        if (state.sessions.length === 0) {
            return;
        }
        if (state.selectedDevices.size === state.sessions.length) {
            dispatch({ type: 'SET_SELECTED_DEVICES', payload: new Set() });
        } else {
            dispatch({
                type: 'SET_SELECTED_DEVICES',
                payload: new Set(state.sessions.map(s => s.deviceId))
            });
        }
    }, [state.sessions, state.selectedDevices]);

    const performLogoutSelected = useCallback(
        async () => {
            dispatch({ type: 'SET_LOGGING_OUT', payload: true });
            try {
                const includesCurrent = state.sessions.some(
                    s => s.isCurrent && state.selectedDevices.has(s.deviceId)
                );
                await logoutFromDevices([...state.selectedDevices]);
                toast.success('Logged out from selected devices');
                if (includesCurrent) {
                    localLogout();
                    navigate('/login');
                    return;
                }
                const remaining = state.sessions.filter(
                    s => !state.selectedDevices.has(s.deviceId)
                );
                const newSelected = new Set(state.selectedDevices);
                state.selectedDevices.forEach(id => newSelected.delete(id));
                dispatch({ type: 'SET_SESSIONS', payload: remaining });
                dispatch({ type: 'SET_SELECTED_DEVICES', payload: newSelected });
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to logout from selected devices');
            } finally {
                dispatch({ type: 'SET_LOGGING_OUT', payload: false });
                dispatch({ type: 'SET_LOGOUT_SELECTED_MODAL_OPEN', payload: false });
            }
        },
        [state.sessions, state.selectedDevices]
    );

    const handleLogoutSelected = useCallback(() => {
        if (state.selectedDevices.size === 0) {
            return;
        }
        const includesCurrent = state.sessions.some(
            s => s.isCurrent && state.selectedDevices.has(s.deviceId)
        );
        if (includesCurrent) {
            dispatch({ type: 'SET_LOGOUT_SELECTED_MODAL_OPEN', payload: true });
            return;
        }
        performLogoutSelected();
    }, [state.selectedDevices, state.sessions, performLogoutSelected]);

    const handleLogoutAll = useCallback(async () => {
        dispatch({ type: 'SET_LOGGING_OUT', payload: true });
        try {
            await logoutAllDevices();
            toast.success('Logged out from all devices');
            localLogout();
            navigate('/login');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to logout from all devices');
        } finally {
            dispatch({ type: 'SET_LOGGING_OUT', payload: false });
        }
    }, []);

    const performLogoutSession = useCallback(
        async (deviceId: string, isCurrent: boolean) => {
            dispatch({ type: 'SET_LOGGING_OUT', payload: true });
            try {
                await logoutFromDevices([deviceId]);
                toast.success('Logged out from device');
                if (isCurrent) {
                    localLogout();
                    navigate('/login');
                    return;
                }
                const filtered = state.sessions.filter(s => s.deviceId !== deviceId);
                const newSelected = new Set(state.selectedDevices);
                newSelected.delete(deviceId);
                dispatch({ type: 'SET_SESSIONS', payload: filtered });
                dispatch({ type: 'SET_SELECTED_DEVICES', payload: newSelected });
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to logout from device');
            } finally {
                dispatch({ type: 'SET_LOGGING_OUT', payload: false });
                dispatch({ type: 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN', payload: false });
                dispatch({ type: 'SET_SESSION_TO_LOGOUT', payload: null });
            }
        },
        [state.sessions, state.selectedDevices]
    );

    const handleLogoutSession = useCallback(
        async (deviceId: string, isCurrent: boolean) => {
            if (isCurrent) {
                dispatch({
                    type: 'SET_SESSION_TO_LOGOUT',
                    payload: { deviceId, isCurrent }
                });
                dispatch({
                    type: 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN',
                    payload: true
                });
                return;
            }
            performLogoutSession(deviceId, isCurrent);
        },
        [performLogoutSession]
    );

    const refresh = useCallback(() => {
        fetchSessions();
    }, [fetchSessions]);

    return {
        state,
        dispatch,
        handleCheckboxChange,
        handleSelectAll,
        handleLogoutSelected,
        performLogoutSelected,
        handleLogoutAll,
        handleLogoutSession,
        performLogoutSession,
        refresh,
    };
};
