import type { RoleCreationRequestExtended } from './createRolesReducer';

export interface RoleUpdationRequestExtended extends RoleCreationRequestExtended {
    clearPermissions: boolean;
}

export interface UpdateRolesState {
    roles: RoleUpdationRequestExtended[];
    leniency: boolean;
    isLoading: boolean;
    errors: Record<number, Record<string, string>>;
    isImportModalOpen: boolean;
    jsonInput: string;
    updatedRoleNames: Set<string>;
}

export const INITIAL_ROLE_UPDATE: RoleUpdationRequestExtended = {
    roleName: '',
    description: null,
    permissions: null,
    permissionsInput: null,
    clearPermissions: false
};

export const initialUpdateRolesState: UpdateRolesState = {
    roles: [{ ...INITIAL_ROLE_UPDATE }],
    leniency: false,
    isLoading: false,
    errors: {},
    isImportModalOpen: false,
    jsonInput: '',
    updatedRoleNames: new Set()
};

export type UpdateRolesAction =
    | { type: 'ADD_ROLE' }
    | { type: 'SET_ROLES'; payload: RoleUpdationRequestExtended[] }
    | { type: 'SET_ERRORS'; payload: Record<number, Record<string, string>> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_UPDATED_ROLE_NAMES'; payload: Set<string> }
    | { type: 'RESET_FORM'; payload?: RoleUpdationRequestExtended[] };

export const updateRolesReducer = (state: UpdateRolesState, action: UpdateRolesAction): UpdateRolesState => {
    switch (action.type) {
        case 'ADD_ROLE':
            return {
                ...state,
                roles: [...state.roles, { ...INITIAL_ROLE_UPDATE }]
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
        case 'SET_UPDATED_ROLE_NAMES':
            return { ...state, updatedRoleNames: action.payload };
        case 'RESET_FORM':
            return initialUpdateRolesState;
        default:
            return state;
    }
};
