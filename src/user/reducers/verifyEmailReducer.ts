export interface VerifyEmailState {
    status: 'loading' | 'success' | 'error';
    message: string | undefined;
}

export const initialVerifyEmailState: VerifyEmailState = {
    status: 'loading',
    message: 'Verifying your email...',
};

export type VerifyEmailAction =
    | { type: 'SET_STATUS'; payload: 'loading' | 'success' | 'error' }
    | { type: 'SET_MESSAGE'; payload: string | undefined }
    | { type: 'RESET_ALL' };

export const verifyEmailReducer = (state: VerifyEmailState, action: VerifyEmailAction): VerifyEmailState => {
    switch (action.type) {
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'SET_MESSAGE':
            return { ...state, message: action.payload };
        case 'RESET_ALL':
            return initialVerifyEmailState;
        default:
            return state;
    }
};
