import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canReadPermissions } from '../../commons/utils/preAuthorizationUtility';
import { validatePermissionName } from '../../commons/utils/validationUtility';
import { readPermissions, type ReadPermissionsResponse } from '../api/adminApis';
import { processReadPermissionsResponse } from '../../commons/utils/responseUtils';
import { initialReadPermissionsState, readPermissionsReducer } from '../reducers/readPermissionsReducer';

export const useReadPermissions = () => {
    const [state, dispatch] = useReducer(readPermissionsReducer, initialReadPermissionsState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canReadPermissions(authorities)) {
            toast.error('You do not have permission to read permissions.');
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
                toast.error('Invalid JSON: Must be an array of strings (permission names).');
                return;
            }
            const isArrayOfStrings = parsed.every(item => typeof item === 'string');
            if (!isArrayOfStrings) {
                toast.error('Invalid JSON: All items in the array must be strings.');
                return;
            }
            const newPermissionNames = parsed.join('\n');
            setInput(newPermissionNames);
            setImportModalOpen(false);
            setJsonInput('');
            toast.success(`Successfully imported ${parsed.length} permission names.`);
        } catch (e) {
            toast.error('Invalid JSON format.');
        }
    };

    const handleSubmit = async () => {
        setValidationError(null);
        dispatch({ type: 'SET_RESULTS', payload: null });
        dispatch({ type: 'SET_LOADING', payload: true });
        if (!state.input.trim()) {
            toast.error('Please enter at least one permission name.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const permissionNames = state.input.split(/[\n, ]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (permissionNames.length === 0) {
            toast.error('Please enter at least one valid permission name.');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
        }
        const invalidPermissionNames: string[] = [];
        const validPermissionNames: string[] = [];
        permissionNames.forEach(name => {
            const error = validatePermissionName(name);
            if (error) {
                invalidPermissionNames.push(name);
            } else {
                validPermissionNames.push(name);
            }
        });
        if (invalidPermissionNames.length > 0) {
            const errorMsg = `Invalid permission names: [${invalidPermissionNames.join(', ')}]. Permission names must contain only letters, digits, and underscores.`;
            setValidationError(errorMsg);
            if (!state.leniency) {
                toast.error('Invalid permission names found. Please fix them or enable Leniency Mode.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            } else {
                toast.info(`Skipping ${invalidPermissionNames.length} invalid permission names due to leniency mode.`);
                if (validPermissionNames.length === 0) {
                    toast.warning('No valid permission names remaining to search.');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }
        }
        try {
            const response: ReadPermissionsResponse = await readPermissions(validPermissionNames, state.leniency);
            if (response) {
                const processedResults = processReadPermissionsResponse(response);
                dispatch({ type: 'SET_RESULTS', payload: processedResults });
                if (response.found_permissions && response.found_permissions.length > 0) {
                    toast.success(`Found ${response.found_permissions.length} permissions.`);
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
            toast.error('Failed to read permissions.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const setLeniency = (value: boolean) => {
        dispatch({ type: 'SET_LENIENCY', payload: value });
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
    };
};
