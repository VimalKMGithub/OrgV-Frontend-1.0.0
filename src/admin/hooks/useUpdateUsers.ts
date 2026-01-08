import { toast } from 'sonner';
import { validateEmail, validateFirstName, validateLastName, validateMiddleName, validatePassword, validateRoleName, validateUsername } from '../../commons/utils/validationUtility';
import { updateUsers, type UpdateUsersResponse, type UserSummaryToCompanyUser, type UserUpdationRequest } from '../api/adminApis';
import { useCallback, useEffect, useReducer } from 'react';
import { initialUpdateUsersState, updateUsersReducer, type UserUpdationRequestExtended } from '../reducers/updateUsersReducer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canUpdateUsers } from '../../commons/utils/preAuthorizationUtility';

export const useUpdateUsers = (initialUsers?: UserUpdationRequestExtended[]) => {
    const [state, dispatch] = useReducer(updateUsersReducer, initialUsers ? { ...initialUpdateUsersState, users: initialUsers } : initialUpdateUsersState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canUpdateUsers(authorities)) {
            toast.error('You do not have permission to update users.');
            navigate('/admin');
        }
    }, [authorities, navigate]);

    const handleAddUser = () => {
        dispatch({ type: 'ADD_USER' });
    };

    const handleRemoveUser = (index: number) => {
        const newUsers = [...state.users];
        newUsers.splice(index, 1);
        const newErrors = { ...state.errors };
        delete newErrors[index];
        for (let i = index; i < newUsers.length; i++) {
            if (newErrors[i + 1]) {
                newErrors[i] = newErrors[i + 1];
            } else {
                delete newErrors[i];
            }
        }
        dispatch({ type: 'SET_USERS', payload: newUsers });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
    };

    const handleUserChange = (index: number, field: keyof UserUpdationRequestExtended, value: any) => {
        const newUsers = [...state.users];
        newUsers[index] = { ...newUsers[index], [field]: value };
        let newErrors = state.errors;
        if (state.errors[index] && state.errors[index][field as string]) {
            newErrors = { ...state.errors };
            const userErrors = { ...newErrors[index] };
            delete userErrors[field as string];
            if (Object.keys(userErrors).length === 0) {
                delete newErrors[index];
            } else {
                newErrors[index] = userErrors;
            }
        }
        dispatch({ type: 'SET_USERS', payload: newUsers });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
    };

    const validateAllUsers = (usersToValidate: UserUpdationRequest[]) => {
        const newErrors: Record<number, Record<string, string>> = {};
        let isValid = true;
        const oldUsernames = new Set<string>();
        const usernames = new Set<string>();
        const emails = new Set<string>();
        usersToValidate.forEach((user, index) => {
            const userErrors: Record<string, string> = {};
            const error = validateUsername(user.oldUsername);
            if (error) {
                userErrors.oldUsername = error;
            } else if (oldUsernames.has(user.oldUsername)) {
                userErrors.oldUsername = 'Duplicate Old Username in request';
            } else {
                oldUsernames.add(user.oldUsername);
            }
            if (user.username?.trim()) {
                const error = validateUsername(user.username);
                if (error) {
                    userErrors.username = error;
                } else if (usernames.has(user.username)) {
                    userErrors.username = 'Duplicate Username in request';
                } else {
                    usernames.add(user.username);
                }
            }
            if (user.email?.trim()) {
                const error = validateEmail(user.email);
                if (error) {
                    userErrors.email = error;
                } else if (emails.has(user.email)) {
                    userErrors.email = 'Duplicate Email in request';
                } else {
                    emails.add(user.email);
                }
            }
            if (user.password?.trim()) {
                const error = validatePassword(user.password);
                if (error) {
                    userErrors.password = error;
                }
            }
            if (user.firstName?.trim()) {
                const error = validateFirstName(user.firstName);
                if (error) {
                    userErrors.firstName = error;
                }
            }
            if (user.middleName?.trim()) {
                const error = validateMiddleName(user.middleName);
                if (error) {
                    userErrors.middleName = error;
                }
            }
            if (user.lastName?.trim()) {
                const error = validateLastName(user.lastName);
                if (error) {
                    userErrors.lastName = error;
                }
            }
            const invalidRoles: string[] = [];
            user.roles?.forEach(role => {
                if (validateRoleName(role)) {
                    invalidRoles.push(role);
                }
            });
            if (invalidRoles.length > 0) {
                userErrors.roles = `Invalid roles: [${invalidRoles.join(', ')}]. Role names must contain only letters, digits, and underscores.`;
            }
            if (user.allowedConcurrentLogins && user.allowedConcurrentLogins < 0) {
                userErrors.allowedConcurrentLogins = 'Allowed concurrent logins must be non-negative';
            }
            if (Object.keys(userErrors).length > 0) {
                newErrors[index] = userErrors;
                isValid = false;
            }
        });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return { isValid, newErrors };
    };

    const mapBackendErrorsToForm = (backendErrors: any) => {
        const newErrors: Record<number, Record<string, string>> = {};
        const notFoundUsers = new Set(backendErrors.users_not_found_with_old_usernames || []);
        const takenUsernames = new Set(backendErrors.usernames_already_taken || []);
        const takenEmails = new Set(backendErrors.emails_already_taken || []);
        const selfUpdate = backendErrors.cannot_update_own_account_using_this_endpoint;
        const missingRoles = new Set(backendErrors.missing_roles || []);
        const notAllowedRoles = new Set(backendErrors.not_allowed_to_assign_roles || []);
        const notAllowedUpdateUsersDueToRestrictions = new Set(backendErrors.cannot_update_users_having_roles_higher_or_equal_than_updater_usernames || []);
        state.users.forEach((user, index) => {
            const userErrors: Record<string, string> = {};
            if (notFoundUsers.has(user.oldUsername)) {
                userErrors.oldUsername = `User '${user.oldUsername}' not found`;
            } else if (selfUpdate === user.oldUsername) {
                userErrors.oldUsername = `Cannot update own account using this endpoint`;
            } else if (notAllowedUpdateUsersDueToRestrictions.has(user.oldUsername)) {
                userErrors.oldUsername = `Not allowed to update user '${user.oldUsername}' having roles higher or equal than updater`;
            }
            if (takenUsernames.has(user.username)) {
                userErrors.username = `Username '${user.username}' is already taken`;
            }
            if (takenEmails.has(user.email)) {
                userErrors.email = `Email '${user.email}' is already taken`;
            }
            const invalidRoles = user.roles?.filter(role => notAllowedRoles.has(role));
            if (invalidRoles?.length) {
                userErrors.roles = `Not allowed to assign roles: [${invalidRoles.join(', ')}]`;
            } else {
                const invalidRoles = user.roles?.filter(role => missingRoles.has(role));
                if (invalidRoles?.length) {
                    userErrors.roles = `Missing roles: [${invalidRoles.join(', ')}]`;
                }
            }
            if (Object.keys(userErrors).length > 0) {
                newErrors[index] = userErrors;
            }
        });
        if (Object.keys(newErrors).length > 0) {
            dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, ...newErrors } });
        }
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
                toast.error('Invalid JSON: Must be an array of user objects.');
                return;
            }
            const newUsers: UserUpdationRequestExtended[] = parsed.map((u: UserUpdationRequestExtended) => ({
                oldUsername: u.oldUsername || '',
                username: u.username || null,
                password: u.password || null,
                email: u.email || null,
                firstName: u.firstName || null,
                middleName: u.middleName || null,
                lastName: u.lastName || null,
                roles: u.roles || null,
                rolesInput: u.roles?.join(', ') || null,
                allowedConcurrentLogins: u.allowedConcurrentLogins || 0,
                emailVerified: u.emailVerified || true,
                accountLocked: u.accountLocked || false,
                accountEnabled: u.accountEnabled || true,
                accountDeleted: u.accountDeleted || false,
                clearRoles: u.clearRoles || false
            }));
            dispatch({ type: 'SET_USERS', payload: newUsers });
            dispatch({ type: 'SET_ERRORS', payload: {} });
            setImportModalOpen(false);
            setJsonInput('');
            toast.success(`Successfully imported ${newUsers.length} users.`);
        } catch (e) {
            toast.error('Invalid JSON format.');
        }
    };

    const handleSubmit = async (onSuccess?: (updatedUsers: UserSummaryToCompanyUser[]) => void) => {
        dispatch({ type: 'SET_UPDATED_USERNAMES', payload: new Set() });
        dispatch({ type: 'SET_LOADING', payload: true });
        const usersWithRoles: UserUpdationRequestExtended[] = state.users.map((user) => {
            let roles: string[] | null = null;
            if (user.clearRoles) {
                roles = [];
            } else {
                const rawRoles = user.rolesInput || '';
                const parsed = rawRoles.split(/[\n, ]+/).map(t => t.trim()).filter(t => t.length > 0);
                if (parsed.length > 0) {
                    roles = parsed;
                }
            }
            return {
                ...user,
                username: user.username?.trim() || null,
                email: user.email?.trim() || null,
                password: user.password?.trim() || null,
                firstName: user.firstName?.trim() || null,
                middleName: user.middleName?.trim() || null,
                lastName: user.lastName?.trim() || null,
                roles: roles
            };
        });
        const { isValid, newErrors } = validateAllUsers(usersWithRoles);
        if (!isValid && !state.leniency) {
            toast.error('Please fix validation errors before submitting.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        let usersToSubmit = usersWithRoles;
        if (state.leniency && !isValid) {
            usersToSubmit = usersWithRoles.filter((_, index) => !newErrors[index]);
            if (usersToSubmit.length === 0) {
                toast.info('No valid users to update.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            toast.info(`Skipping ${state.users.length - usersToSubmit.length} invalid users due to leniency mode.`);
        }
        try {
            const response: UpdateUsersResponse = await updateUsers(usersToSubmit, state.leniency);
            if (response.message) {
                toast.info(response.message);
            }
            const reasons = response.reasons_due_to_which_users_has_not_been_updated || response.reasons_due_to_which_some_users_has_not_been_updated;
            if (reasons) {
                mapBackendErrorsToForm(reasons);
            }
            if (response.updated_users) {
                dispatch({ type: 'SET_UPDATED_USERNAMES', payload: new Set(response.updated_users.map(u => u.username)) });
                toast.success(`Successfully updated ${response.updated_users.length} users.`);
                onSuccess?.(response.updated_users);
            }
        } catch (error: any) {
            if (error.response?.data) {
                if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                }
                mapBackendErrorsToForm(error.response.data);
            }
            toast.error('Failed to update users.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const reset = useCallback((newInitialUsers?: UserUpdationRequestExtended[]) => {
        if (newInitialUsers) {
            dispatch({ type: 'SET_USERS', payload: newInitialUsers });
            dispatch({ type: 'SET_ERRORS', payload: {} });
            dispatch({ type: 'SET_UPDATED_USERNAMES', payload: new Set() });
        } else {
            dispatch({ type: 'RESET_FORM' });
        }
    }, []);

    const setLeniency = (value: boolean) => {
        dispatch({ type: 'SET_LENIENCY', payload: value });
    };

    return {
        state,
        dispatch,
        handleAddUser,
        handleRemoveUser,
        handleUserChange,
        handleJsonImport,
        reset,
        setLeniency,
        setImportModalOpen,
        setJsonInput,
        handleSubmit,
    };
};
