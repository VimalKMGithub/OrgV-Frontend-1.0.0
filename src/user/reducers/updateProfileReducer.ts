export interface UpdateProfileState {
    isLoading: boolean;
    formData: {
        username: string;
        firstName: string;
        middleName: string;
        lastName: string;
        oldPassword: string;
    };
    errors: Record<string, string>;
}

export const initialUpdateProfileState: UpdateProfileState = {
    isLoading: false,
    formData: {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        oldPassword: ''
    },
    errors: {},
};

export type UpdateProfileAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_FORM_DATA'; payload: Partial<UpdateProfileState['formData']> }
    | { type: 'SET_ERRORS'; payload: Record<string, string> }
    | { type: 'RESET_FORM' };

export const updateProfileReducer = (state: UpdateProfileState, action: UpdateProfileAction): UpdateProfileState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_FORM_DATA':
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'RESET_FORM':
            return initialUpdateProfileState;
        default:
            return state;
    }
};
