import { useReducer, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canDeleteRoles } from '../../commons/utils/preAuthorizationUtility';
import { deleteRoles, type DeleteRolesResponse } from '../api/adminApis';
import { processDeleteRolesResponse } from '../../commons/utils/responseUtils';
import { validateRoleName } from '../../commons/utils/validationUtility';
import { initialDeleteRolesState, deleteRolesReducer } from '../reducers/deleteRolesReducer';

export const useDeleteRoles = () => {
    const [state, dispatch] = useReducer(deleteRolesReducer, initialDeleteRolesState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canDeleteRoles(authorities)) {
            toast.error('You do not have permission to delete roles.');
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
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_RESULTS', payload: null });
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
        roleNames.forEach(role => {
            if (validateRoleName(role)) {
                invalidRoleNames.push(role);
            } else {
                validRoleNames.push(role);
            }
        });
        if (invalidRoleNames.length > 0) {
            const errorMsg = `Invalid role name format: [${invalidRoleNames.join(', ')}]`;
            setValidationError(errorMsg);
            if (!state.leniency) {
                toast.error('Invalid role names found. Please fix them or enable Leniency Mode.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            } else {
                toast.info(`Skipping ${invalidRoleNames.length} invalid role names due to leniency mode.`);
                if (validRoleNames.length === 0) {
                    toast.warning('No valid role names remaining to delete.');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }
        }
        await executeDelete(validRoleNames);
    };

    const executeDelete = async (roleNames: string[], onSuccess?: (results: any) => void) => {
        try {
            const response: DeleteRolesResponse = await deleteRoles(roleNames, state.forceDelete, state.leniency);
            if (response) {
                const processedResults = processDeleteRolesResponse(response);
                dispatch({ type: 'SET_RESULTS', payload: processedResults });
                if (response.message) {
                    if (response.message.includes('successfully')) {
                        toast.success(response.message);
                        onSuccess?.(processedResults);
                    } else {
                        toast.info(response.message);
                    }
                }
            }
        } catch (error: any) {
            if (error.response?.data) {
                if (error.response.data?.message) {
                    toast.error(error.response.data.message);
                }
                dispatch({ type: 'SET_RESULTS', payload: error.response.data });
            }
            toast.error('Failed to delete roles.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const setForceDelete = (value: boolean) => {
        dispatch({ type: 'SET_FORCE_DELETE', payload: value });
    };

    const setLeniency = (value: boolean) => {
        dispatch({ type: 'SET_LENIENCY', payload: value });
    };

    return {
        state,
        dispatch,
        handleSubmit,
        handleJsonImport,
        reset,
        setForceDelete,
        setLeniency,
        setInput,
        setValidationError,
        setImportModalOpen,
        setJsonInput,
        executeDelete
    };
};
