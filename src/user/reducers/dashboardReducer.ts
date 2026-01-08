export interface DashboardState {
    isLoggingOut: boolean;
}

export const initialDashboardState: DashboardState = {
    isLoggingOut: false,
};

export type DashboardAction =
    | { type: 'SET_LOGGING_OUT'; payload: boolean };

export const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
    switch (action.type) {
        case 'SET_LOGGING_OUT':
            return { ...state, isLoggingOut: action.payload };
        default:
            return state;
    }
};
