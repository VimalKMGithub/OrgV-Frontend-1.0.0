import { useReducer, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateRegistrationInputs } from '../../commons/utils/validationUtility';
import { register, type RegisterResponse } from '../api/userApis';
import { initialRegisterState, registerReducer } from '../reducers/registerReducer';

export const useRegister = () => {
    const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } });
        if (state.errors[name]) {
            dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, [name]: '' } });
        }
    };

    const validateForm = () => {
        const newErrors = validateRegistrationInputs(state.formData);
        if (state.formData.password !== state.formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password does not match';
        }
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response: RegisterResponse = await register({
                username: state.formData.username,
                email: state.formData.email,
                password: state.formData.password,
                firstName: state.formData.firstName,
                middleName: state.formData.middleName || null,
                lastName: state.formData.lastName || null,
            });
            toast.success(response.message);
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const newErrors: Record<string, string> = {};
                const lowerCaseError = errorMessage.toLowerCase();
                if (lowerCaseError.includes('username')) {
                    newErrors.username = errorMessage;
                } else if (lowerCaseError.includes('email')) {
                    newErrors.email = errorMessage;
                } else {
                    toast.error(errorMessage);
                }
                if (Object.keys(newErrors).length > 0) {
                    dispatch({ type: 'SET_ERRORS', payload: newErrors });
                }
            } else {
                toast.error('Registration failed!');
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
