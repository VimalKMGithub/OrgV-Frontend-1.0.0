import type { UserSummaryToCompanyUser } from '../api/adminApis';
import type { UserUpdationRequestExtended } from './updateUsersReducer';

export interface ReadUsersState {
    input: string;
    leniency: boolean;
    isLoading: boolean;
    results: any;
    validationError: string | null;
    isImportModalOpen: boolean;
    jsonInput: string;
    selectedUsersIds: Set<string>;
    isDeleteModalOpen: boolean;
    usersToDelete: UserSummaryToCompanyUser[];
    isUpdateModalOpen: boolean;
    usersToUpdate: UserUpdationRequestExtended[];
}

export const initialReadUsersState: ReadUsersState = {
    input: '',
    leniency: false,
    isLoading: false,
    results: null,
    validationError: null,
    isImportModalOpen: false,
    jsonInput: '',
    selectedUsersIds: new Set(),
    isDeleteModalOpen: false,
    usersToDelete: [],
    isUpdateModalOpen: false,
    usersToUpdate: [],
};

export type ReadUsersAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_RESULTS'; payload: any }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'SET_VALIDATION_ERROR'; payload: string | null }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_SELECTED_USERS_IDS'; payload: Set<string> }
    | { type: 'SET_DELETE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_USERS_TO_DELETE'; payload: UserSummaryToCompanyUser[] }
    | { type: 'SET_UPDATE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_USERS_TO_UPDATE'; payload: UserUpdationRequestExtended[] }
    | { type: 'RESET' };

export const readUsersReducer = (state: ReadUsersState, action: ReadUsersAction): ReadUsersState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
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
        case 'SET_SELECTED_USERS_IDS':
            return { ...state, selectedUsersIds: action.payload };
        case 'SET_DELETE_MODAL_OPEN':
            return { ...state, isDeleteModalOpen: action.payload };
        case 'SET_USERS_TO_DELETE':
            return { ...state, usersToDelete: action.payload };
        case 'SET_UPDATE_MODAL_OPEN':
            return { ...state, isUpdateModalOpen: action.payload };
        case 'SET_USERS_TO_UPDATE':
            return { ...state, usersToUpdate: action.payload };
        case 'RESET':
            return initialReadUsersState;
        default:
            return state;
    }
};
