import { useReducer, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import { validateFirstName, validateLastName, validateMiddleName, validatePassword, validateUsername } from '../../commons/utils/validationUtility';
import { updateDetails, type UpdateDetailsResponse } from '../api/userApis';
import { initialUpdateProfileState, updateProfileReducer } from '../reducers/updateProfileReducer';

export const useUpdateProfile = () => {
    const [state, dispatch] = useReducer(updateProfileReducer, initialUpdateProfileState);
    const { user, checkAuth, localLogout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            dispatch({
                type: 'SET_FORM_DATA',
                payload: {
                    username: user.username || '',
                    firstName: user.firstName || '',
                    middleName: user.middleName || '',
                    lastName: user.lastName || ''
                }
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } });
        if (state.errors[name]) {
            dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, [name]: '' } });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        const { formData } = state;

        if (formData.username) {
            const usernameError = validateUsername(formData.username);
            if (usernameError) {
                newErrors.username = usernameError;
            }
        }
        if (formData.firstName) {
            const firstNameError = validateFirstName(formData.firstName);
            if (firstNameError) {
                newErrors.firstName = firstNameError;
            }
        }
        if (formData.middleName) {
            const middleNameError = validateMiddleName(formData.middleName);
            if (middleNameError) {
                newErrors.middleName = middleNameError;
            }
        }
        if (formData.lastName) {
            const lastNameError = validateLastName(formData.lastName);
            if (lastNameError) {
                newErrors.lastName = lastNameError;
            }
        }
        const oldPasswordError = validatePassword(formData.oldPassword);
        if (oldPasswordError) {
            newErrors.oldPassword = oldPasswordError;
        }
        if (Object.keys(newErrors).length > 0) {
            dispatch({ type: 'SET_ERRORS', payload: newErrors });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const payload = {
                username: formData.username.trim() === '' ? null : formData.username,
                firstName: formData.firstName.trim() === '' ? null : formData.firstName,
                middleName: formData.middleName.trim() === '' ? null : formData.middleName,
                lastName: formData.lastName.trim() === '' ? null : formData.lastName,
                oldPassword: formData.oldPassword
            };
            const response: UpdateDetailsResponse = await updateDetails(payload);
            const message = response.message;
            toast.success(message);
            if (message.includes('login again')) {
                localLogout();
                navigate('/login');
            } else {
                await checkAuth();
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update profile.');
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return {
        state,
        dispatch,
        handleChange,
        handleSubmit,
    };
};
