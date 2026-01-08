export interface DeleteAccountState {
    isLoading: boolean;
    step: 'PASSWORD' | 'SELECT_MFA' | 'VERIFY_MFA';
    password: string;
    mfaMethods: string[];
    selectedMethod: string;
    otp: string;
    errors: Record<string, string>;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialDeleteAccountState: DeleteAccountState = {
    isLoading: false,
    step: 'PASSWORD',
    password: '',
    mfaMethods: [],
    selectedMethod: '',
    otp: '',
    errors: {},
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type DeleteAccountAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_STEP'; payload: 'PASSWORD' | 'SELECT_MFA' | 'VERIFY_MFA' }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_MFA_METHODS'; payload: string[] }
    | { type: 'SET_SELECTED_METHOD'; payload: string }
    | { type: 'SET_OTP'; payload: string }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET_ALL' };

export const deleteAccountReducer = (state: DeleteAccountState, action: DeleteAccountAction): DeleteAccountState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_MFA_METHODS':
            return { ...state, mfaMethods: action.payload };
        case 'SET_SELECTED_METHOD':
            return { ...state, selectedMethod: action.payload };
        case 'SET_OTP':
            return { ...state, otp: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET_ALL':
            return initialDeleteAccountState;
        default:
            return state;
    }
};
