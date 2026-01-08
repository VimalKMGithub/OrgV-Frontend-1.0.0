export interface ResendVerificationState {
    identifier: string;
    error: string;
    isLoading: boolean;
}

export const initialResendVerificationState: ResendVerificationState = {
    identifier: '',
    error: '',
    isLoading: false,
};

export type ResendVerificationAction =
    | { type: 'SET_IDENTIFIER'; payload: string }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'RESET_ALL' };

export const resendVerificationReducer = (state: ResendVerificationState, action: ResendVerificationAction): ResendVerificationState => {
    switch (action.type) {
        case 'SET_IDENTIFIER':
            return { ...state, identifier: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'RESET_ALL':
            return initialResendVerificationState;
        default:
            return state;
    }
};
