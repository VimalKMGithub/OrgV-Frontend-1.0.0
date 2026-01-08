import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canReadRoles } from '../../commons/utils/preAuthorizationUtility';
import { validateRoleName } from '../../commons/utils/validationUtility';
import { processReadRolesResponse } from '../../commons/utils/responseUtils';
import { initialReadRolesState, readRolesReducer } from '../reducers/readRolesReducer';
import { readRoles, type ReadRolesResponse, type RoleSummary } from '../api/adminApis';
import { INITIAL_ROLE_UPDATE, type RoleUpdationRequestExtended } from '../reducers/updateRolesReducer';

export const useReadRoles = () => {
    const [state, dispatch] = useReducer(readRolesReducer, initialReadRolesState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canReadRoles(authorities)) {
            toast.error('You do not have permission to read roles.');
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
                toast.error('Invalid JSON: Must be an array of strings (role names).');
                return;
            }
            const isArrayOfStrings = parsed.every(item => typeof item === 'string');
            if (!isArrayOfStrings) {
                toast.error('Invalid JSON: All items in the array must be strings.');
                return;
            }
            const newRoleNames = parsed.join('\n');
            setInput(newRoleNames);
            setImportModalOpen(false);
            setJsonInput('');
            toast.success(`Successfully imported ${parsed.length} role names.`);
        } catch (e) {
            toast.error('Invalid JSON format.');
        }
    };

    const handleSubmit = async () => {
        setValidationError(null);
        dispatch({ type: 'SET_RESULTS', payload: null });
        dispatch({ type: 'SET_LOADING', payload: true });
        if (!state.input.trim()) {
            toast.error('Please enter at least one role name.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const roleNames = state.input.split(/[\n, ]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (roleNames.length === 0) {
            toast.error('Please enter at least one valid role name.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const invalidRoleNames: string[] = [];
        const validRoleNames: string[] = [];
        roleNames.forEach(name => {
            const error = validateRoleName(name);
            if (error) {
                invalidRoleNames.push(name);
            } else {
                validRoleNames.push(name);
            }
        });
        if (invalidRoleNames.length > 0) {
            const errorMsg = `Invalid role names: [${invalidRoleNames.join(', ')}]. Role names must contain only letters, digits, and underscores.`;
            setValidationError(errorMsg);
            if (!state.leniency) {
                toast.error('Invalid role names found. Please fix them or enable Leniency Mode.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            } else {
                toast.info(`Skipping ${invalidRoleNames.length} invalid role names due to leniency mode.`);
                if (validRoleNames.length === 0) {
                    toast.warning('No valid role names remaining to search.');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }
        }
        try {
            const response: ReadRolesResponse = await readRoles(validRoleNames, state.leniency);
            if (response) {
                const processedResults = processReadRolesResponse(response);
                dispatch({ type: 'SET_RESULTS', payload: processedResults });
                if (response.found_roles && response.found_roles.length > 0) {
                    toast.success(`Found ${response.found_roles.length} roles.`);
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
            toast.error('Failed to read roles.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleDeleteClick = (role: RoleSummary) => {
        dispatch({ type: 'SET_ROLES_TO_DELETE', payload: [role] });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleBulkDeleteClick = () => {
        if (!state.results || !state.results.found_roles) {
            return;
        }
        const roles = state.results.found_roles.filter((r: any) => state.selectedRoleNames.has(r.roleName));
        if (roles.length === 0) {
            return;
        }
        dispatch({ type: 'SET_ROLES_TO_DELETE', payload: roles });
        dispatch({ type: 'SET_DELETE_MODAL_OPEN', payload: true });
    };

    const handleUpdateClick = (role: RoleSummary) => {
        const mappedRole: RoleUpdationRequestExtended = {
            ...INITIAL_ROLE_UPDATE,
            roleName: role.roleName,
        };
        dispatch({ type: 'SET_ROLES_TO_UPDATE', payload: [mappedRole] });
        dispatch({ type: 'SET_UPDATE_MODAL_OPEN', payload: true });
    };

    const handleBulkUpdateClick = () => {
        const selectedRoles = state.results.found_roles.filter((role: RoleSummary) => state.selectedRoleNames.has(role.roleName));
        if (selectedRoles.length === 0) {
            return;
        }
        const roles: RoleUpdationRequestExtended[] = selectedRoles.map((role: RoleSummary) => ({
            ...INITIAL_ROLE_UPDATE,
            roleName: role.roleName,
        }));
        dispatch({ type: 'SET_ROLES_TO_UPDATE', payload: roles });
        dispatch({ type: 'SET_UPDATE_MODAL_OPEN', payload: true });
    };

    const handleDeleteSuccess = (deleteResults: any) => {
        const roleNames = new Set<string>(state.rolesToDelete.map(r => r.roleName));
        const failedRoleNames = new Set<string>([
            ...(deleteResults?.system_roles_cannot_be_deleted || []),
            ...(deleteResults?.roles_assigned_to_users || [])
        ]);
        if (state.results && state.results.found_roles) {
            dispatch({
                type: 'SET_RESULTS',
                payload: {
                    ...state.results,
                    found_roles: state.results.found_roles.filter((r: any) =>
                        !roleNames.has(r.roleName) || failedRoleNames.has(r.roleName)
                    )
                }
            });
            const newSelectedRoleNames = new Set(state.selectedRoleNames);
            state.rolesToDelete.forEach(r => {
                if (!failedRoleNames.has(r.roleName)) {
                    newSelectedRoleNames.delete(r.roleName);
                }
            });
            dispatch({ type: 'SET_SELECTED_ROLE_NAMES', payload: newSelectedRoleNames });
        }
    };

    const handleCheckboxChange = (role: RoleSummary) => {
        const newSelectedNames = new Set(state.selectedRoleNames);
        if (newSelectedNames.has(role.roleName)) {
            newSelectedNames.delete(role.roleName);
        } else {
            newSelectedNames.add(role.roleName);
        }
        dispatch({ type: 'SET_SELECTED_ROLE_NAMES', payload: newSelectedNames });
    };

    const handleSelectAll = () => {
        if (state.results && state.results.found_roles) {
            if (state.selectedRoleNames.size === state.results.found_roles.length) {
                dispatch({ type: 'SET_SELECTED_ROLE_NAMES', payload: new Set() });
            } else {
                const allNames = new Set<string>(state.results.found_roles.map((r: RoleSummary) => r.roleName));
                dispatch({ type: 'SET_SELECTED_ROLE_NAMES', payload: allNames });
            }
        }
    };

    const handleUpdateSuccess = (updatedRoles: RoleSummary[]) => {
        if (state.results && state.results.found_roles && state.results.found_roles.length > 0) {
            const updateMap = new Map<string, RoleSummary>(updatedRoles.map(r => [r.roleName, r]));
            const updatedFoundRoles = state.results.found_roles.map((role: RoleSummary) => {
                return updateMap.get(role.roleName) || role;
            });
            dispatch({
                type: 'SET_RESULTS',
                payload: {
                    ...state.results,
                    found_roles: updatedFoundRoles
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
