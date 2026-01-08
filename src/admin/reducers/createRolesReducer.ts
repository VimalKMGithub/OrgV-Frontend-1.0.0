import { type RoleCreationUpdationRequest } from '../api/adminApis';

export interface RoleCreationRequestExtended extends RoleCreationUpdationRequest {
    permissionsInput: string | null;
}

export interface CreateRolesState {
    roles: RoleCreationRequestExtended[];
    leniency: boolean;
    isLoading: boolean;
    errors: Record<number, Record<string, string>>;
    isImportModalOpen: boolean;
    jsonInput: string;
    createdRoleNames: Set<string>;
}

export const INITIAL_ROLE: RoleCreationRequestExtended = {
    roleName: '',
    description: null,
    permissions: null,
    permissionsInput: null
};

export const initialCreateRolesState: CreateRolesState = {
    roles: [{ ...INITIAL_ROLE }],
    leniency: false,
    isLoading: false,
    errors: {},
    isImportModalOpen: false,
    jsonInput: '',
    createdRoleNames: new Set(),
};

export type CreateRolesAction =
    | { type: 'ADD_ROLE' }
    | { type: 'SET_ROLES'; payload: RoleCreationRequestExtended[] }
    | { type: 'SET_ERRORS'; payload: Record<number, Record<string, string>> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_CREATED_ROLE_NAMES'; payload: Set<string> }
    | { type: 'RESET_FORM' };

export const createRolesReducer = (state: CreateRolesState, action: CreateRolesAction): CreateRolesState => {
    switch (action.type) {
        case 'ADD_ROLE':
            return {
                ...state,
                roles: [...state.roles, { ...INITIAL_ROLE }]
            };
        case 'SET_ROLES':
            return { ...state, roles: action.payload };
        case 'SET_ERRORS':
            return { ...state, errors: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LENIENCY':
            return { ...state, leniency: action.payload };
        case 'SET_IMPORT_MODAL_OPEN':
            return { ...state, isImportModalOpen: action.payload };
        case 'SET_JSON_INPUT':
            return { ...state, jsonInput: action.payload };
        case 'SET_CREATED_ROLE_NAMES':
            return { ...state, createdRoleNames: action.payload };
        case 'RESET_FORM':
            return initialCreateRolesState;
        default:
            return state;
    }
};
