import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canReadUsers } from '../../commons/utils/preAuthorizationUtility';
import { validateUserIdentifier } from '../../commons/utils/validationUtility';
import { readUsers, type ReadUsersResponse, type UserSummaryToCompanyUser } from '../api/adminApis';
import { processReadUsersResponse } from '../../commons/utils/responseUtils';
import { INITIAL_USER_UPDATE, type UserUpdationRequestExtended } from '../reducers/updateUsersReducer';
import { initialReadUsersState, readUsersReducer } from '../reducers/readUsersReducer';

export const useReadUsers = () => {
    const [state, dispatch] = useReducer(readUsersReducer, initialReadUsersState);
    const navigate = useNavigate();
    const { user, authorities } = useAuth();

    useEffect(() => {
        if (!canReadUsers(authorities)) {
            toast.error('You do not have permission to read users.');
            navigate('/admin');
        }
    }, [authorities, navigate]);

    const setValidationError = (value: string | null) => {
        dispatch({ type: 'SET_VALIDATION_ERROR', payload: value });
    };

    const setInput = (value: string) => {
        dispatch({ type: 'SET_INPUT', payload: value });
        setValidationError(null);
    };

    const setImportModalOpen = (value: boolean) => {
        dispatch({ type: 'SET_IMPORT_MODAL_OPEN', payload: value });
    };

    const setJsonInput = (value: string) => {
        dispatch({ type: 'SET_JSON_INPUT', payload: value });
    };

    const handleJsonImport = () => {
        try {
            const parsed = JSON.parse(state.jsonInput);
            if (!Array.isArray(parsed)) {
                toast.error('Invalid JSON: Must be an array of strings (usernames, emails, or IDs).');
                return;
            }
            const isArrayOfStrings = parsed.every(item => typeof item === 'string');
            if (!isArrayOfStrings) {
                toast.error('Invalid JSON: All items in the array must be strings.');
                return;
            }
            const newIdentifiers = parsed.join('\n');
            setInput(newIdentifiers);
            setImportModalOpen(false);
            setJsonInput('');
            toast.success(`Successfully imported ${parsed.length} identifiers.`);
        } catch (e) {
            toast.error('Invalid JSON format.');
        }
    };

    const handleSubmit = async () => {
        setValidationError(null);
        dispatch({ type: 'SET_RESULTS', payload: null });
        dispatch({ type: 'SET_LOADING', payload: true });
        if (!state.input.trim()) {
            toast.error('Please enter at least one username, email, or ID.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const identifiers = state.input.split(/[\n, ]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (identifiers.length === 0) {
            toast.error('Please enter at least one valid identifier.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const invalidIdentifiers: string[] = [];
        const validIdentifiers: string[] = [];
        identifiers.forEach(id => {
            const error = validateUserIdentifier(id);
            if (error) {
                invalidIdentifiers.push(id);
            } else {
                validIdentifiers.push(id);
            }
        });
        if (invalidIdentifiers.length > 0) {
            const errorMsg = `Invalid identifiers format (must be Username, Email, or UUID): [${invalidIdentifiers.join(', ')}]`;
            dispatch({ type: 'SET_VALIDATION_ERROR', payload: errorMsg });
            if (!state.leniency) {
                toast.error('Invalid identifiers found. Please fix them or enable Leniency Mode.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            } else {
                toast.info(`Skipping ${invalidIdentifiers.length} invalid identifiers due to leniency mode.`);
                if (validIdentifiers.length === 0) {
                    toast.warning('No valid identifiers remaining to search.');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }
        }
        try {
            const response: ReadUsersResponse = await readUsers(validIdentifiers, state.leniency);
            if (response) {
                const processedResults = processReadUsersResponse(response);
                dispatch({ type: 'SET_RESULTS', payload: processedResults });
                if (response.found_users && response.found_users.length > 0) {
                    toast.success(`Found ${response.found_users.length} users.`);
                } else if (response.message) {
                    toast.info(response.message);
                }
            }
        } catch (error: any) {
            if (error.response?.data) {
                if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                }
                dispatch({ type: 'SET_RESULTS', payload: error.response.data });
            }
            toast.error('Failed to read users.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleDeleteClick = (user: UserSummaryToCompanyUser) => {
        dispatch({ type: 'SET_USERS_TO_DELETE', payload: [user] });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleBulkDeleteClick = () => {
        if (!state.results || !state.results.found_users) {
            return;
        }
        const users = state.results.found_users.filter((u: any) => state.selectedUsersIds.has(u.id));
        if (users.length === 0) {
            return;
        }
        dispatch({ type: 'SET_USERS_TO_DELETE', payload: users });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleUpdateClick = (user: UserSummaryToCompanyUser) => {
        const mappedUser: UserUpdationRequestExtended = {
            ...INITIAL_USER_UPDATE,
            oldUsername: user.username,
        };
        dispatch({ type: 'SET_USERS_TO_UPDATE', payload: [mappedUser] });
        dispatch({ type: 'SET_UPDATE_MODAL_OPEN', payload: true });
    };

    const handleBulkUpdateClick = () => {
        if (!state.results || !state.results.found_users) {
            return;
        }
        const selectedUsers = state.results.found_users.filter((u: any) => state.selectedUsersIds.has(u.id));
        if (selectedUsers.length === 0) {
            return;
        }
        const users: UserUpdationRequestExtended[] = selectedUsers.map((u: any) => ({
            ...INITIAL_USER_UPDATE,
            oldUsername: u.username,
        }));
        dispatch({ type: 'SET_USERS_TO_UPDATE', payload: users });
        dispatch({ type: 'SET_UPDATE_MODAL_OPEN', payload: true });
    };

    const handleDeleteSuccess = (deleteResults: any, isHardDelete: boolean) => {
        const usernames = new Set<string>(state.usersToDelete.map(u => u.username));
        const failedUsernames = new Set<string>([
            ...(deleteResults?.cannot_delete_users_having_roles_higher_or_equal_than_deleter_identifiers || []),
            ...(deleteResults?.you_cannot_delete_your_own_account_using_this_endpoint || [])
        ]);
        if (state.results && state.results.found_users) {
            if (isHardDelete) {
                dispatch({
                    type: 'SET_RESULTS',
                    payload: {
                        ...state.results,
                        found_users: state.results.found_users.filter((u: any) =>
                            !usernames.has(u.username) || failedUsernames.has(u.username)
                        )
                    }
                });
                const newSelectedIds = new Set(state.selectedUsersIds);
                state.usersToDelete.forEach(u => {
                    if (!failedUsernames.has(u.username)) {
                        newSelectedIds.delete(u.id);
                    }
                });
                dispatch({ type: 'SET_SELECTED_USERS_IDS', payload: newSelectedIds });
            } else {
                dispatch({
                    type: 'SET_RESULTS',
                    payload: {
                        ...state.results,
                        found_users: state.results.found_users.map((u: any) => {
                            if (usernames.has(u.username) && !failedUsernames.has(u.username)) {
                                return {
                                    ...u,
                                    accountDeleted: true,
                                    accountDeletedAt: new Date().toISOString(),
                                    accountDeletedBy: user?.username || 'Admin'
                                };
                            }
                            return u;
                        })
                    }
                });
            }
        }
    };

    const handleCheckboxChange = (user: UserSummaryToCompanyUser) => {
        const newSelectedIds = new Set(state.selectedUsersIds);
        if (newSelectedIds.has(user.id)) {
            newSelectedIds.delete(user.id);
        } else {
            newSelectedIds.add(user.id);
        }
        dispatch({ type: 'SET_SELECTED_USERS_IDS', payload: newSelectedIds });
    };

    const handleSelectAll = () => {
        if (state.results && state.results.found_users) {
            if (state.selectedUsersIds.size === state.results.found_users.length) {
                dispatch({ type: 'SET_SELECTED_USERS_IDS', payload: new Set() });
            } else {
                const allIds = new Set<string>(state.results.found_users.map((u: UserSummaryToCompanyUser) => u.id));
                dispatch({ type: 'SET_SELECTED_USERS_IDS', payload: allIds });
            }
        }
    };

    const handleUpdateSuccess = (updatedUsers: UserSummaryToCompanyUser[]) => {
        if (state.results && state.results.found_users && updatedUsers.length > 0) {
            const updateMap = new Map<string, UserSummaryToCompanyUser>(updatedUsers.map(u => [u.id, u]));
            const updatedFoundUsers = state.results.found_users.map((user: UserSummaryToCompanyUser) => {
                return updateMap.get(user.id) || user;
            });
            dispatch({
                type: 'SET_RESULTS',
                payload: {
                    ...state.results,
                    found_users: updatedFoundUsers
                }
            });
        }
    };

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const setLeniency = (value: boolean) => {
        dispatch({ type: 'SET_LENIENCY', payload: value });
    };

    const setDeleteModalOpen = (value: boolean) => {
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: value });
    };

    const setUpdateModalOpen = (value: boolean) => {
        dispatch({ type: 'SET_UPDATE_MODAL_OPEN', payload: value });
    };

    return {
        state,
        dispatch,
        handleSubmit,
        handleJsonImport,
        reset,
        setLeniency,
        setInput,
        setValidationError,
        setImportModalOpen,
        setJsonInput,
        handleDeleteClick,
        handleBulkDeleteClick,
        handleUpdateClick,
        handleBulkUpdateClick,
        handleDeleteSuccess,
        handleCheckboxChange,
        handleSelectAll,
        handleUpdateSuccess,
        setDeleteModalOpen,
        setUpdateModalOpen
    };
};
