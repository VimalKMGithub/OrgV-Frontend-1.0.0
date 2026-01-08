import { useReducer, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { validateUuid } from '../../commons/utils/validationUtility';
import { verifyEmail as verifyEmailApi, type VerifyEmailResponse } from '../api/userApis';
import { initialVerifyEmailState, verifyEmailReducer } from '../reducers/verifyEmailReducer';

export const useVerifyEmail = () => {
    const [state, dispatch] = useReducer(verifyEmailReducer, initialVerifyEmailState);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('emailVerificationToken');
            if (!token) {
                dispatch({ type: 'SET_STATUS', payload: 'error' });
                dispatch({ type: 'SET_MESSAGE', payload: 'Invalid verification link. Token is missing.' });
                return;
            }
            if (validateUuid(token)) {
                dispatch({ type: 'SET_STATUS', payload: 'error' });
                dispatch({ type: 'SET_MESSAGE', payload: 'Invalid verification link. Token is invalid.' });
                return;
            }
            try {
                const response: VerifyEmailResponse = await verifyEmailApi({
                    emailVerificationToken: token
                });
                dispatch({ type: 'SET_STATUS', payload: 'success' });
                dispatch({ type: 'SET_MESSAGE', payload: response.message });
                toast.success('Email verified successfully!');
            } catch (error: any) {
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Failed to verify email.');
                }
                dispatch({ type: 'SET_STATUS', payload: 'error' });
            }
        };
        verifyEmail();
    }, [searchParams]);

    return {
        state,
    };
};
