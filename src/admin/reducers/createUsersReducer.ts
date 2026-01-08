import { type CreateUserRequest } from '../api/adminApis';

export interface CreateUserRequestExtended extends CreateUserRequest {
    rolesInput: string | null;
}

export interface CreateUsersState {
    users: CreateUserRequestExtended[];
    leniency: boolean;
    isLoading: boolean;
    errors: Record<number, Record<string, string>>;
    isImportModalOpen: boolean;
    jsonInput: string;
    createdUsernames: Set<string>;
}

export const INITIAL_USER: CreateUserRequestExtended = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    middleName: null,
    lastName: null,
    roles: null,
    rolesInput: null,
    allowedConcurrentLogins: 1,
    emailVerified: true,
    accountLocked: false,
    accountEnabled: true,
    accountDeleted: false
};

export const initialCreateUsersState: CreateUsersState = {
    users: [{ ...INITIAL_USER }],
    leniency: false,
    isLoading: false,
    errors: {},
    isImportModalOpen: false,
    jsonInput: '',
    createdUsernames: new Set(),
};

export type CreateUsersAction =
    | { type: 'ADD_USER' }
    | { type: 'SET_USERS'; payload: CreateUserRequestExtended[] }
    | { type: 'SET_ERRORS'; payload: Record<number, Record<string, string>> }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LENIENCY'; payload: boolean }
    | { type: 'SET_IMPORT_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_JSON_INPUT'; payload: string }
    | { type: 'SET_CREATED_USERNAMES'; payload: Set<string> }
    | { type: 'RESET_FORM' };

export const createUsersReducer = (state: CreateUsersState, action: CreateUsersAction): CreateUsersState => {
    switch (action.type) {
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, { ...INITIAL_USER }]
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
        case 'SET_CREATED_USERNAMES':
            return { ...state, createdUsernames: action.payload };
        case 'RESET_FORM':
            return initialCreateUsersState;
        default:
            return state;
    }
};
