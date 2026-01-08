export interface ChangePasswordState {
    isLoading: boolean;
    step: 'INPUT_PASSWORDS' | 'SELECT_MFA' | 'VERIFY_MFA';
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    errors: Record<string, string>;
    mfaMethods: string[];
    selectedMethod: string | null;
    loadingMethod: string | null;
    otp: string;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialChangePasswordState: ChangePasswordState = {
    isLoading: false,
    step: 'INPUT_PASSWORDS',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    errors: {},
    mfaMethods: [],
    selectedMethod: null,
    loadingMethod: null,
    otp: '',
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type ChangePasswordAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_STEP'; payload: 'INPUT_PASSWORDS' | 'SELECT_MFA' | 'VERIFY_MFA' }
    | { type: 'SET_OLD_PASSWORD'; payload: string }
    | { type: 'SET_NEW_PASSWORD'; payload: string }
    | { type: 'SET_CONFIRM_NEW_PASSWORD'; payload: string }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_MFA_METHODS'; payload: string[] }
    | { type: 'SET_SELECTED_METHOD'; payload: string | null }
    | { type: 'SET_LOADING_METHOD'; payload: string | null }
    | { type: 'SET_OTP'; payload: string }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET' };

export const changePasswordReducer = (state: ChangePasswordState, action: ChangePasswordAction): ChangePasswordState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_OLD_PASSWORD':
            return { ...state, oldPassword: action.payload };
        case 'SET_NEW_PASSWORD':
            return { ...state, newPassword: action.payload };
        case 'SET_CONFIRM_NEW_PASSWORD':
            return { ...state, confirmNewPassword: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_MFA_METHODS':
            return { ...state, mfaMethods: action.payload };
        case 'SET_SELECTED_METHOD':
            return { ...state, selectedMethod: action.payload };
        case 'SET_LOADING_METHOD':
            return { ...state, loadingMethod: action.payload };
        case 'SET_OTP':
            return { ...state, otp: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET':
            return initialChangePasswordState;
        default:
            return state;
    }
};
