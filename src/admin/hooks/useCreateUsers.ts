import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canCreateUsers } from '../../commons/utils/preAuthorizationUtility';
import { validateRegistrationInputs, validateRoleName } from '../../commons/utils/validationUtility';
import { createUsers, type CreateUserRequest, type CreateUsersResponse } from '../api/adminApis';
import { initialCreateUsersState, createUsersReducer, type CreateUserRequestExtended } from '../reducers/createUsersReducer';

export const useCreateUsers = () => {
    const [state, dispatch] = useReducer(createUsersReducer, initialCreateUsersState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canCreateUsers(authorities)) {
            toast.error('You do not have permission to create users.');
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

    const handleUserChange = (index: number, field: keyof CreateUserRequestExtended, value: any) => {
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

    const validateAllUsers = (usersToValidate: CreateUserRequest[]) => {
        const newErrors: Record<number, Record<string, string>> = {};
        let isValid = true;
        const usernames = new Set<string>();
        const emails = new Set<string>();
        usersToValidate.forEach((user, index) => {
            const userErrors: Record<string, string> = validateRegistrationInputs({
                username: user.username,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName
            });
            const invalidRoles: string[] = [];
            user.roles?.forEach(role => {
                if (validateRoleName(role)) {
                    invalidRoles.push(role);
                }
            });
            if (invalidRoles.length > 0) {
                userErrors.roles = `Invalid roles: [${invalidRoles.join(', ')}]. Role names must contain only letters, digits, and underscores.`;
            }
            if (user.allowedConcurrentLogins < 1) {
                userErrors.allowedConcurrentLogins = 'Allowed concurrent logins must be at least 1';
            }
            if (usernames.has(user.username)) {
                userErrors.username = 'Duplicate username in request';
            } else if (user.username) {
                usernames.add(user.username);
            }
            if (emails.has(user.email)) {
                userErrors.email = 'Duplicate email in request';
            } else if (user.email) {
                emails.add(user.email);
            }
            if (Object.keys(userErrors).length > 0) {
                newErrors[index] = userErrors;
                isValid = false;
            }
        });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return { isValid, newErrors };
    };

    const mapBackendErrorsToForm = (backendErrors: any, usersToCheck: CreateUserRequest[]) => {
        const newErrors: Record<number, Record<string, string>> = {};
        const takenUsernames = new Set(backendErrors.already_taken_usernames || []);
        const takenEmails = new Set(backendErrors.already_taken_emails || []);
        const notAllowedRoles = new Set(backendErrors.not_allowed_to_assign_roles || []);
        const missingRoles = new Set(backendErrors.missing_roles || []);
        usersToCheck.forEach((user, index) => {
            const userErrors: Record<string, string> = {};
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
            const newUsers: CreateUserRequestExtended[] = parsed.map((u: CreateUserRequestExtended) => ({
                username: u.username || '',
                password: u.password || '',
                email: u.email || '',
                firstName: u.firstName || '',
                middleName: u.middleName || null,
                lastName: u.lastName || null,
                roles: u.roles || null,
                rolesInput: u.roles?.join(', ') || null,
                allowedConcurrentLogins: u.allowedConcurrentLogins || 1,
                emailVerified: u.emailVerified || true,
                accountLocked: u.accountLocked || false,
                accountEnabled: u.accountEnabled || true,
                accountDeleted: u.accountDeleted || false
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

    const handleSubmit = async () => {
        dispatch({ type: 'SET_CREATED_USERNAMES', payload: new Set() });
        dispatch({ type: 'SET_LOADING', payload: true });
        const usersWithRoles: CreateUserRequestExtended[] = state.users.map((user) => {
            const rawRoles = user.rolesInput || '';
            const roles = rawRoles.split(/[\n, ]+/).map(t => t.trim()).filter(t => t.length > 0);
            return {
                ...user,
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
                toast.info('No valid users to create.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            toast.info(`Skipping ${state.users.length - usersToSubmit.length} invalid users due to leniency mode.`);
        }
        try {
            const response: CreateUsersResponse = await createUsers(usersToSubmit, state.leniency);
            if (response.message) {
                toast.info(response.message);
            }
            const reasons = response.reasons_due_to_which_users_has_not_been_created || response.reasons_due_to_which_some_users_has_not_been_created;
            if (reasons) {
                mapBackendErrorsToForm(reasons, usersWithRoles);
            }
            if (response.created_users) {
                dispatch({ type: 'SET_CREATED_USERNAMES', payload: new Set(response.created_users.map(u => u.username)) });
                toast.success(`Successfully created ${response.created_users.length} users.`);
            }
        } catch (error: any) {
            if (error.response?.data) {
                if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                }
                mapBackendErrorsToForm(error.response.data, usersWithRoles);
            }
            toast.error('Failed to create users.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const reset = useCallback(() => {
        dispatch({ type: 'RESET_FORM' });
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
