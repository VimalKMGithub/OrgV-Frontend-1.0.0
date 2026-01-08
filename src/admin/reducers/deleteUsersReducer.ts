export interface DeleteUsersState {
    isLoading: boolean;
    results: any;
    hardDelete: boolean;
    leniency: boolean;
    input: string;
    validationError: string | null;
    isImportModalOpen: boolean;
    jsonInput: string;
}

export const initialDeleteUsersState: DeleteUsersState = {
    isLoading: false,
    results: null,
    hardDelete: false,
    leniency: false,
    input: '',
    validationError: null,
    isImportModalOpen: false,
    jsonInput: '',
};

export type DeleteUsersAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_RESULTS'; payload: any }
    | { type: 'SET_HARD_DELETE'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'SET_VALIDATION_ERROR'; payload: string | null }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'RESET' };

export const deleteUsersReducer = (state: DeleteUsersState, action: DeleteUsersAction): DeleteUsersState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_HARD_DELETE':
            return { ...state, hardDelete: action.payload };
        case 'SET_LENIENCY':
            return { ...state, leniency: action.payload };
        case 'SET_INPUT':
            return { ...state, input: action.payload };
        case 'SET_VALIDATION_ERROR':
            return { ...state, validationError: action.payload };
        case 'SET_IMPORT_MODAL_OPEN':
            return { ...state, isImportModalOpen: action.payload };
        case 'SET_JSON_INPUT':
            return { ...state, jsonInput: action.payload };
        case 'RESET':
            return initialDeleteUsersState;
        default:
            return state;
    }
};
