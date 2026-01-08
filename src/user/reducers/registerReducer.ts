export interface RegisterState {
    formData: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        firstName: string;
        middleName: string;
        lastName: string;
    };
    errors: Record<string, string>;
    isLoading: boolean;
}

export const initialRegisterState: RegisterState = {
    formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        middleName: '',
        lastName: '',
    },
    errors: {},
    isLoading: false,
};

export type RegisterAction =
    | { type: 'SET_FORM_DATA'; payload: Partial<RegisterState['formData']> }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'RESET_FORM' };

export const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'RESET_FORM':
            return initialRegisterState;
        default:
            return state;
    }
};
