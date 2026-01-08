import { type Session } from '../pages/ActiveSessionsPage';

export interface ActiveSessionsState {
    sessions: Session[];
    selectedDevices: Set<string>;
    isLoading: boolean;
    isLoggingOut: boolean;
    isLogoutAllModalOpen: boolean;
    isLogoutSelectedModalOpen: boolean;
    sessionToLogout: { deviceId: string, isCurrent: boolean } | null;
    isLogoutCurrentSessionModalOpen: boolean;
}

export const initialActiveSessionsState: ActiveSessionsState = {
    sessions: [],
    selectedDevices: new Set(),
    isLoading: true,
    isLoggingOut: false,
    isLogoutAllModalOpen: false,
    isLogoutSelectedModalOpen: false,
    sessionToLogout: null,
    isLogoutCurrentSessionModalOpen: false,
};

export type ActiveSessionsAction =
    | { type: 'SET_SESSIONS'; payload: Session[] }
    | { type: 'SET_SELECTED_DEVICES'; payload: Set<string> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LOGGING_OUT'; payload: boolean }
    | { type: 'SET_LOGOUT_ALL_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_LOGOUT_SELECTED_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_SESSION_TO_LOGOUT'; payload: { deviceId: string, isCurrent: boolean } | null }
    | { type: 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN'; payload: boolean };

export const activeSessionsReducer = (state: ActiveSessionsState, action: ActiveSessionsAction): ActiveSessionsState => {
    switch (action.type) {
        case 'SET_SESSIONS':
            return { ...state, sessions: action.payload };
        case 'SET_SELECTED_DEVICES':
            return { ...state, selectedDevices: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LOGGING_OUT':
            return { ...state, isLoggingOut: action.payload };
        case 'SET_LOGOUT_ALL_MODAL_OPEN':
            return { ...state, isLogoutAllModalOpen: action.payload };
        case 'SET_LOGOUT_SELECTED_MODAL_OPEN':
            return { ...state, isLogoutSelectedModalOpen: action.payload };
        case 'SET_SESSION_TO_LOGOUT':
            return { ...state, sessionToLogout: action.payload };
        case 'SET_LOGOUT_CURRENT_SESSION_MODAL_OPEN':
            return { ...state, isLogoutCurrentSessionModalOpen: action.payload };
        default:
            return state;
    }
};
