import { type UserUpdationRequest } from '../api/adminApis';

export interface UserUpdationRequestExtended extends UserUpdationRequest {
    rolesInput: string | null;
    clearRoles: boolean;
}

export interface UpdateUsersState {
    users: UserUpdationRequestExtended[];
    leniency: boolean;
    isLoading: boolean;
    roleInputs: string[];
    errors: Record<number, Record<string, string>>;
    isImportModalOpen: boolean;
    jsonInput: string;
    updatedUsernames: Set<string>;
}

export const INITIAL_USER_UPDATE: UserUpdationRequestExtended = {
    oldUsername: '',
    username: null,
    password: null,
    email: null,
    firstName: null,
    middleName: null,
    lastName: null,
    roles: null,
    rolesInput: null,
    allowedConcurrentLogins: 0,
    emailVerified: true,
    accountLocked: false,
    accountEnabled: true,
    accountDeleted: false,
    clearRoles: false
};

export const initialUpdateUsersState: UpdateUsersState = {
    users: [{ ...INITIAL_USER_UPDATE }],
    leniency: false,
    isLoading: false,
    roleInputs: [''],
    errors: {},
    isImportModalOpen: false,
    jsonInput: '',
    updatedUsernames: new Set(),
};

export type UpdateUsersAction =
    | { type: 'ADD_USER' }
    | { type: 'SET_USERS'; payload: UserUpdationRequestExtended[] }
    | { type: 'SET_ERRORS'; payload: Record<number, Record<string, string>> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_UPDATED_USERNAMES'; payload: Set<string> }
    | { type: 'RESET_FORM' };

export const updateUsersReducer = (state: UpdateUsersState, action: UpdateUsersAction): UpdateUsersState => {
    switch (action.type) {
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, { ...INITIAL_USER_UPDATE }]
            };
        case 'SET_USERS':
            return { ...state, users: action.payload };
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
        case 'SET_UPDATED_USERNAMES':
            return { ...state, updatedUsernames: action.payload };
        case 'RESET_FORM':
            return initialUpdateUsersState;
        default:
            return state;
    }
};
