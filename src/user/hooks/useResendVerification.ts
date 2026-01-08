import { useReducer, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateUserIdentifier } from '../../commons/utils/validationUtility';
import { resendEmailVerificationLink, type ResendEmailVerificationLinkResponse } from '../api/userApis';
import { initialResendVerificationState, resendVerificationReducer } from '../reducers/resendVerificationReducer';

export const useResendVerification = () => {
    const [state, dispatch] = useReducer(resendVerificationReducer, initialResendVerificationState);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validateUserIdentifier(state.identifier);
        if (validationError) {
            dispatch({ type: 'SET_ERROR', payload: validationError });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: ResendEmailVerificationLinkResponse = await resendEmailVerificationLink({
                usernameOrEmailOrId: state.identifier
            });
            toast.success(response.message);
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('user')) {
                    dispatch({ type: 'SET_ERROR', payload: errorMessage });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to resend verification link.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return {
        state,
        dispatch,
        handleSubmit,
    };
};
