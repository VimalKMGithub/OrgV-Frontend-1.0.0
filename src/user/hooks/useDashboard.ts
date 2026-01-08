import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../commons/contexts/AuthContext';
import { initialDashboardState, dashboardReducer } from '../reducers/dashboardReducer';

export const useDashboard = () => {
    const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
    const { user, authorities, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        dispatch({ type: 'SET_LOGGING_OUT', payload: true });
        try {
            await logout();
            navigate('/login');
        } finally {
            dispatch({ type: 'SET_LOGGING_OUT', payload: false });
        }
    };

    return {
        state,
        user,
        authorities,
        handleLogout,
        navigate,
    };
};
