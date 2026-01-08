export interface MfaSettingsState {
    isLoading: boolean;
    activeMethod: string | null;
    isEnabling: boolean;
    step: 'LIST' | 'VERIFY';
    qrCodeUrl: string | null;
    otp: string;
    error: string;
    sessionCountdown: number;
    resendCountdown: number;
}

export const initialMfaSettingsState: MfaSettingsState = {
    isLoading: false,
    activeMethod: null,
    isEnabling: false,
    step: 'LIST',
    qrCodeUrl: null,
    otp: '',
    error: '',
    sessionCountdown: 0,
    resendCountdown: 0,
};

export type MfaSettingsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ACTIVE_METHOD'; payload: string | null }
    | { type: 'SET_IS_ENABLING'; payload: boolean }
    | { type: 'SET_STEP'; payload: 'LIST' | 'VERIFY' }
    | { type: 'SET_QR_CODE_URL'; payload: string | null }
    | { type: 'SET_OTP'; payload: string }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_SESSION_COUNTDOWN'; payload: number }
    | { type: 'SET_RESEND_COUNTDOWN'; payload: number }
    | { type: 'RESET_VERIFY' }
    | { type: 'RESET' };

export const mfaSettingsReducer = (state: MfaSettingsState, action: MfaSettingsAction): MfaSettingsState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ACTIVE_METHOD':
            return { ...state, activeMethod: action.payload };
        case 'SET_IS_ENABLING':
            return { ...state, isEnabling: action.payload };
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SET_QR_CODE_URL':
            return { ...state, qrCodeUrl: action.payload };
        case 'SET_OTP':
            return { ...state, otp: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_SESSION_COUNTDOWN':
            return { ...state, sessionCountdown: action.payload };
        case 'SET_RESEND_COUNTDOWN':
            return { ...state, resendCountdown: action.payload };
        case 'RESET_VERIFY':
            return {
                ...state,
                step: 'LIST',
                activeMethod: null,
                otp: '',
                qrCodeUrl: null,
                error: '',
                sessionCountdown: 0,
                resendCountdown: 0,
            };
        case 'RESET':
            return initialMfaSettingsState;
        default:
            return state;
    }
};
