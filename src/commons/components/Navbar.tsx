import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate('/login');
        } finally {
            setIsLoggingOut(false);
        }
    };
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            OrgV
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <>
                                <span className="text-slate-700 dark:text-slate-300 hidden sm:block">
                                    Welcome, {user?.firstName || user?.username}
                                </span>
                                <Button variant="outline" onClick={handleLogout} isLoading={isLoggingOut} className="!py-1 !px-3 text-sm">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" className="!py-1 !px-3 text-sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" className="!py-1 !px-3 text-sm">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
