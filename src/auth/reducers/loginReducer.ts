export interface LoginState {
    username: string;
    password: string;
    errors: Record<string, string>;
    isLoading: boolean;
    isLoadingSocial: boolean;
    selectedSocialLogin: 'GOOGLE' | 'GITHUB';
    step: 'LOGIN' | 'MFA_SELECTION' | 'MFA_VERIFICATION';
    mfaMethods: string[];
    stateToken: string;
    selectedMethod: string;
    otp: string;
    loadingMethod: string | null;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialLoginState: LoginState = {
    username: '',
    password: '',
    errors: {},
    isLoading: false,
    isLoadingSocial: false,
    selectedSocialLogin: 'GOOGLE',
    step: 'LOGIN',
    mfaMethods: [],
    stateToken: '',
    selectedMethod: '',
    otp: '',
    loadingMethod: null,
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type LoginAction =
    | { type: 'SET_USERNAME'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LOADING_SOCIAL'; payload: boolean }
    | { type: 'SET_SELECTED_SOCIAL_LOGIN'; payload: 'GOOGLE' | 'GITHUB' }
    | { type: 'SET_STEP'; payload: 'LOGIN' | 'MFA_SELECTION' | 'MFA_VERIFICATION' }
    | { type: 'SET_MFA_METHODS'; payload: string[] }
    | { type: 'SET_STATE_TOKEN'; payload: string }
    | { type: 'SET_SELECTED_METHOD'; payload: string }
    | { type: 'SET_OTP'; payload: string }
    | { type: 'SET_LOADING_METHOD'; payload: string | null }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET_MFA' }
    | { type: 'RESET' };

export const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
    switch (action.type) {
        case 'SET_USERNAME':
            return { ...state, username: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LOADING_SOCIAL':
            return { ...state, isLoadingSocial: action.payload };
        case 'SET_SELECTED_SOCIAL_LOGIN':
            return { ...state, selectedSocialLogin: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_MFA_METHODS':
            return { ...state, mfaMethods: action.payload };
        case 'SET_STATE_TOKEN':
            return { ...state, stateToken: action.payload };
        case 'SET_SELECTED_METHOD':
            return { ...state, selectedMethod: action.payload };
        case 'SET_OTP':
            return { ...state, otp: action.payload };
        case 'SET_LOADING_METHOD':
            return { ...state, loadingMethod: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET_MFA':
            return {
                ...state,
                step: 'MFA_SELECTION',
                otp: '',
                errors: {},
            };
        case 'RESET':
            return initialLoginState;
        default:
            return state;
    }
};
