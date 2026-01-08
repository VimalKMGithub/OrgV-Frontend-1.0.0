export interface ChangeEmailState {
    isLoading: boolean;
    step: 'REQUEST' | 'VERIFY';
    newEmail: string;
    oldEmailOtp: string;
    newEmailOtp: string;
    password: string;
    errors: Record<string, string>;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialChangeEmailState: ChangeEmailState = {
    isLoading: false,
    step: 'REQUEST',
    newEmail: '',
    oldEmailOtp: '',
    newEmailOtp: '',
    password: '',
    errors: {},
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type ChangeEmailAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_STEP'; payload: 'REQUEST' | 'VERIFY' }
    | { type: 'SET_NEW_EMAIL'; payload: string }
    | { type: 'SET_OLD_EMAIL_OTP'; payload: string }
    | { type: 'SET_NEW_EMAIL_OTP'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET' };

export const changeEmailReducer = (state: ChangeEmailState, action: ChangeEmailAction): ChangeEmailState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_NEW_EMAIL':
            return { ...state, newEmail: action.payload };
        case 'SET_OLD_EMAIL_OTP':
            return { ...state, oldEmailOtp: action.payload };
        case 'SET_NEW_EMAIL_OTP':
            return { ...state, newEmailOtp: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET':
            return initialChangeEmailState;
        default:
            return state;
    }
};
