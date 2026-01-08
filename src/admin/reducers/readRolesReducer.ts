import { type RoleSummary } from '../api/adminApis';
import type { RoleUpdationRequestExtended } from './updateRolesReducer';

export interface ReadRolesState {
    input: string;
    leniency: boolean;
    isLoading: boolean;
    results: any;
    validationError: string | null;
    isImportModalOpen: boolean;
    jsonInput: string;
    selectedRoleNames: Set<string>;
    isDeleteModalOpen: boolean;
    rolesToDelete: RoleSummary[];
    isUpdateModalOpen: boolean;
    rolesToUpdate: RoleUpdationRequestExtended[];
}

export const initialReadRolesState: ReadRolesState = {
    input: '',
    leniency: false,
    isLoading: false,
    results: null,
    validationError: null,
    isImportModalOpen: false,
    jsonInput: '',
    selectedRoleNames: new Set(),
    isDeleteModalOpen: false,
    rolesToDelete: [],
    isUpdateModalOpen: false,
    rolesToUpdate: [],
};

export type ReadRolesAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_RESULTS'; payload: any }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'SET_VALIDATION_ERROR'; payload: string | null }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_SELECTED_ROLE_NAMES'; payload: Set<string> }
    | { type: 'SET_DELETE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ROLES_TO_DELETE'; payload: RoleSummary[] }
    | { type: 'SET_UPDATE_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_ROLES_TO_UPDATE'; payload: RoleUpdationRequestExtended[] }
    | { type: 'RESET' };

export const readRolesReducer = (state: ReadRolesState, action: ReadRolesAction): ReadRolesState => {
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
        case 'SET_SELECTED_ROLE_NAMES':
            return { ...state, selectedRoleNames: action.payload };
        case 'SET_DELETE_MODAL_OPEN':
            return { ...state, isDeleteModalOpen: action.payload };
        case 'SET_ROLES_TO_DELETE':
            return { ...state, rolesToDelete: action.payload };
        case 'SET_UPDATE_MODAL_OPEN':
            return { ...state, isUpdateModalOpen: action.payload };
        case 'SET_ROLES_TO_UPDATE':
            return { ...state, rolesToUpdate: action.payload };
        case 'RESET':
            return initialReadRolesState;
        default:
            return state;
    }
};
