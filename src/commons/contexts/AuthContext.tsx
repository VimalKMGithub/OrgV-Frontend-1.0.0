import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { logout as logoutApi, fetchCsrfToken } from '../../auth/api/authApis';
import { selfDetails, type UserSummary } from '../../user/api/userApis';
import { extractUserAuthorities } from '../utils/authorityUtility';

export interface AuthContextType {
    user: UserSummary | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authorities: Set<string>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    localLogout: () => void;
    checkAuth: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSummary | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authorities, setAuthorities] = useState<Set<string>>(new Set());
    const checkAuth = async () => {
        try {
            const user = await selfDetails();
            setUser(user);
            setIsAuthenticated(true);
        } catch (error: any) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const initAuth = async () => {
            try {
                await fetchCsrfToken();
            } catch (error) {
                console.error("Failed to fetch CSRF token", error);
            }
            await checkAuth();
        };
        initAuth();
    }, []);
    useEffect(() => {
        setAuthorities(extractUserAuthorities(user));
    }, [user]);
    useEffect(() => {
        const handleSessionExpired = () => {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
        };
        window.addEventListener('auth:session-expired', handleSessionExpired);
        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, []);
    const login = async () => {
        await checkAuth();
    };
    const localLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'logout') {
                localLogout();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const logout = async () => {
        try {
            await logoutApi();
        } catch (error: any) {
        }
        localStorage.setItem('logout', Date.now().toString());
        localLogout();
    };
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, authorities, login, logout, localLogout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
