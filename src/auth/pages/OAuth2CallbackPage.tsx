import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../commons/contexts/AuthContext';
import LoadingSpinner from '../../commons/components/LoadingSpinner';

const OAuth2CallbackPage = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const processLogin = async () => {
            const error = searchParams.get('error');
            if (error) {
                toast.error(error);
                navigate('/login');
                return;
            }
            try {
                await login();
                toast.success('Login successful!');
                navigate('/');
            } catch (err) {
                toast.error('Login verification failed.');
                navigate('/login');
            }
        };
        processLogin();
    }, [login, navigate, searchParams]);

    return (
        <LoadingSpinner />
    );
};

export default OAuth2CallbackPage;
