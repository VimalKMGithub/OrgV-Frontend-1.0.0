import { useReducer, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { canDeleteUsers } from '../../commons/utils/preAuthorizationUtility';
import { deleteUsers, type DeleteUsersResponse } from '../api/adminApis';
import { processDeleteUsersResponse } from '../../commons/utils/responseUtils';
import { validateUserIdentifier } from '../../commons/utils/validationUtility';
import { initialDeleteUsersState, deleteUsersReducer } from '../reducers/deleteUsersReducer';

export const useDeleteUsers = () => {
    const [state, dispatch] = useReducer(deleteUsersReducer, initialDeleteUsersState);
    const navigate = useNavigate();
    const { authorities } = useAuth();

    useEffect(() => {
        if (!canDeleteUsers(authorities)) {
            toast.error('You do not have permission to delete users.');
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
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_RESULTS', payload: null });
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
            if (validateUserIdentifier(id)) {
                invalidIdentifiers.push(id);
            } else {
                validIdentifiers.push(id);
            }
        });
        if (invalidIdentifiers.length > 0) {
            const errorMsg = `Invalid identifiers format (must be Username, Email, or UUID): [${invalidIdentifiers.join(', ')}]`;
            setValidationError(errorMsg);
            if (!state.leniency) {
                toast.error('Invalid identifiers found. Please fix them or enable Leniency Mode.');
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            } else {
                toast.info(`Skipping ${invalidIdentifiers.length} invalid identifiers due to leniency mode.`);
                if (validIdentifiers.length === 0) {
                    toast.warning('No valid identifiers remaining to delete.');
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }
            }
        }
        await executeDelete(validIdentifiers);
    };

    const executeDelete = async (identifiers: string[], onSuccess?: (results: any) => void) => {
        try {
            const response: DeleteUsersResponse = await deleteUsers(identifiers, state.hardDelete, state.leniency);
            if (response) {
                const processedResults = processDeleteUsersResponse(response);
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
            toast.error('Failed to delete users.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const setHardDelete = (value: boolean) => {
        dispatch({ type: 'SET_HARD_DELETE', payload: value });
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
        setHardDelete,
        setLeniency,
        setInput,
        setValidationError,
        setImportModalOpen,
        setJsonInput,
        executeDelete
    };
};
