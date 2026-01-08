export interface ForgotPasswordState {
    identifier: string;
    step: 'INPUT_ID' | 'SELECT_METHOD' | 'RESET_PASSWORD';
    methods: string[];
    isLoading: boolean;
    error: string;
    loadingMethod: string | null;
    selectedMethod: string | null;
    resetFormData: {
        otpTotp: string;
        newPassword: string;
        confirmNewPassword: string;
    };
    resetErrors: Record<string, string>;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialForgotPasswordState: ForgotPasswordState = {
    identifier: '',
    step: 'INPUT_ID',
    methods: [],
    isLoading: false,
    error: '',
    loadingMethod: null,
    selectedMethod: null,
    resetFormData: {
        otpTotp: '',
        newPassword: '',
        confirmNewPassword: '',
    },
    resetErrors: {},
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type ForgotPasswordAction =
    | { type: 'SET_IDENTIFIER'; payload: string }
    | { type: 'SET_STEP'; payload: 'INPUT_ID' | 'SELECT_METHOD' | 'RESET_PASSWORD' }
    | { type: 'SET_METHODS'; payload: string[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_LOADING_METHOD'; payload: string | null }
    | { type: 'SET_SELECTED_METHOD'; payload: string | null }
    | { type: 'SET_RESET_FORM_DATA'; payload: Partial<ForgotPasswordState['resetFormData']> }
    | { type: 'SET_RESET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET' };

export const forgotPasswordReducer = (state: ForgotPasswordState, action: ForgotPasswordAction): ForgotPasswordState => {
    switch (action.type) {
        case 'SET_IDENTIFIER':
            return { ...state, identifier: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_METHODS':
            return { ...state, methods: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_LOADING_METHOD':
            return { ...state, loadingMethod: action.payload };
        case 'SET_SELECTED_METHOD':
            return { ...state, selectedMethod: action.payload };
        case 'SET_RESET_FORM_DATA':
            return { ...state, resetFormData: { ...state.resetFormData, ...action.payload } };
        case 'SET_RESET_ERRORS':
            return { ...state, resetErrors: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET':
            return initialForgotPasswordState;
        default:
            return state;
    }
};
