export interface DeleteRolesState {
    isLoading: boolean;
    results: any;
    forceDelete: boolean;
    leniency: boolean;
    input: string;
    validationError: string | null;
    isImportModalOpen: boolean;
    jsonInput: string;
}

export const initialDeleteRolesState: DeleteRolesState = {
    isLoading: false,
    results: null,
    forceDelete: false,
    leniency: false,
    input: '',
    validationError: null,
    isImportModalOpen: false,
    jsonInput: '',
};

export type DeleteRolesAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_RESULTS'; payload: any }
    | { type: 'SET_FORCE_DELETE'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'SET_VALIDATION_ERROR'; payload: string | null }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'RESET' };

export const deleteRolesReducer = (state: DeleteRolesState, action: DeleteRolesAction): DeleteRolesState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_FORCE_DELETE':
            return { ...state, forceDelete: action.payload };
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
            return initialDeleteRolesState;
        default:
            return state;
    }
};
