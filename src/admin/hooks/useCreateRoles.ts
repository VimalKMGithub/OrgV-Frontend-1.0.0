import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canCreateRoles } from '../../commons/utils/preAuthorizationUtility';
import { validatePermissionName, validateRoleName } from '../../commons/utils/validationUtility';
import { createRoles, type RoleCreationUpdationRequest, type CreateRolesResponse } from '../api/adminApis';
import { initialCreateRolesState, createRolesReducer, type RoleCreationRequestExtended } from '../reducers/createRolesReducer';

export const useCreateRoles = () => {
    const [state, dispatch] = useReducer(createRolesReducer, initialCreateRolesState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canCreateRoles(authorities)) {
            toast.error('You do not have permission to create roles.');
            navigate('/admin');
        }
    }, [authorities, navigate]);

    const handleAddRole = () => {
        dispatch({ type: 'ADD_ROLE' });
    };

    const handleRemoveRole = (index: number) => {
        const newRoles = [...state.roles];
        newRoles.splice(index, 1);
        const newErrors = { ...state.errors };
        delete newErrors[index];
        for (let i = index; i < newRoles.length; i++) {
            if (newErrors[i + 1]) {
                newErrors[i] = newErrors[i + 1];
            } else {
                delete newErrors[i];
            }
        }
        dispatch({ type: 'SET_ROLES', payload: newRoles });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
    };

    const handleRoleChange = (index: number, field: keyof RoleCreationRequestExtended, value: any) => {
        const newRoles = [...state.roles];
        newRoles[index] = { ...newRoles[index], [field]: value };
        let newErrors = state.errors;
        if (state.errors[index] && state.errors[index][field as string]) {
            newErrors = { ...state.errors };
            const roleErrors = { ...newErrors[index] };
            delete roleErrors[field as string];
            if (Object.keys(roleErrors).length === 0) {
                delete newErrors[index];
            } else {
                newErrors[index] = roleErrors;
            }
        }
        dispatch({ type: 'SET_ROLES', payload: newRoles });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
    };

    const validateAllRoles = (rolesToValidate: RoleCreationUpdationRequest[]) => {
        const newErrors: Record<number, Record<string, string>> = {};
        let isValid = true;
        const roleNames = new Set<string>();
        rolesToValidate.forEach((role, index) => {
            const roleErrors: Record<string, string> = {};
            const nameError = validateRoleName(role.roleName);
            if (nameError) {
                roleErrors.roleName = nameError;
            }
            if (role.description && role.description.length > 255) {
                roleErrors.description = 'Description must be at most 255 characters long';
            }
            if (roleNames.has(role.roleName)) {
                roleErrors.roleName = 'Duplicate role name in request';
            } else if (role.roleName) {
                roleNames.add(role.roleName);
            }
            const invalidPermissions: string[] = [];
            role.permissions?.forEach((perm) => {
                if (validatePermissionName(perm)) {
                    invalidPermissions.push(perm);
                }
            });
            if (invalidPermissions.length > 0) {
                roleErrors.permissions = `Invalid permissions: [${invalidPermissions.join(', ')}]. Permission names must contain only letters, digits, and underscores.`;
            }
            if (Object.keys(roleErrors).length > 0) {
                newErrors[index] = roleErrors;
                isValid = false;
            }
        });
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return { isValid, newErrors };
    };

    const mapBackendErrorsToForm = (backendErrors: any, rolesToCheck: RoleCreationUpdationRequest[]) => {
        const newErrors: Record<number, Record<string, string>> = {};
        const takenRoleNames = new Set(backendErrors.role_names_already_taken || []);
        const missingPermissions = new Set(backendErrors.missing_permissions || []);
        rolesToCheck.forEach((role, index) => {
            const roleErrors: Record<string, string> = {};
            if (takenRoleNames.has(role.roleName)) {
                roleErrors.roleName = `Role name '${role.roleName}' is already taken`;
            }
            const invalidPerm = role.permissions?.filter(perm => missingPermissions.has(perm)) || [];
            if (invalidPerm.length > 0) {
                roleErrors.permissions = `Missing permissions: [${invalidPerm.join(', ')}]`;
            }
            if (Object.keys(roleErrors).length > 0) {
                newErrors[index] = roleErrors;
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
                toast.error('Invalid JSON: Must be an array of role objects.');
                return;
            }
            const newRoles: RoleCreationRequestExtended[] = parsed.map((r: RoleCreationRequestExtended) => ({
                roleName: r.roleName || '',
                description: r.description || null,
                permissions: r.permissions || null,
                permissionsInput: r.permissions?.join(', ') || ''
            }));
            dispatch({ type: 'SET_ROLES', payload: newRoles });
            dispatch({ type: 'SET_ERRORS', payload: {} });
            setImportModalOpen(false);
            setJsonInput('');
            toast.success(`Successfully imported ${newRoles.length} roles.`);
        } catch (e) {
            toast.error('Invalid JSON format.');
        }
    };

    const handleSubmit = async () => {
        dispatch({ type: 'SET_CREATED_ROLE_NAMES', payload: new Set() });
        dispatch({ type: 'SET_LOADING', payload: true });
        const rolesWithPermissions: RoleCreationRequestExtended[] = state.roles.map((role) => {
            const rawPermissions = role.permissionsInput || '';
            const permissions = rawPermissions.split(/[\n, ]+/).map(t => t.trim()).filter(t => t.length > 0);
            return {
                ...role,
                description: role.description && role.description.trim() !== '' ? role.description : null,
                permissions: permissions
            };
        });
        const { isValid, newErrors } = validateAllRoles(rolesWithPermissions);
        if (!isValid && !state.leniency) {
            toast.error('Please fix validation errors before submitting.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        let rolesToSubmit = rolesWithPermissions;
        if (state.leniency && !isValid) {
            rolesToSubmit = rolesWithPermissions.filter((_, index) => !newErrors[index]);
            if (rolesToSubmit.length === 0) {
                toast.info('No valid roles to create.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            toast.info(`Skipping ${state.roles.length - rolesToSubmit.length} invalid roles due to leniency mode.`);
        }
        try {
            const response: CreateRolesResponse = await createRoles(rolesToSubmit, state.leniency);
            if (response.message) {
                toast.info(response.message);
            }
            const reasons = response.reasons_due_to_which_roles_has_not_been_created || response.reasons_due_to_which_some_roles_has_not_been_created;
            if (reasons) {
                mapBackendErrorsToForm(reasons, rolesWithPermissions);
            }
            if (response.created_roles) {
                dispatch({ type: 'SET_CREATED_ROLE_NAMES', payload: new Set(response.created_roles.map(r => r.roleName)) });
                toast.success(`Successfully created ${response.created_roles.length} roles.`);
            }
        } catch (error: any) {
            if (error.response?.data) {
                if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                }
                mapBackendErrorsToForm(error.response.data, rolesWithPermissions);
            }
            toast.error('Failed to create roles.');
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
        handleAddRole,
        handleRemoveRole,
        handleRoleChange,
        handleJsonImport,
        reset,
        setLeniency,
        setImportModalOpen,
        setJsonInput,
        handleSubmit,
    };
};
