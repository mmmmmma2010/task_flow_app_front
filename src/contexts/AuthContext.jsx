import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u) : null;
        } catch {
            return null;
        }
    });

    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem('access_token') || null
    );

    const isAuthenticated = !!accessToken;

    const login = useCallback(async (username, password) => {
        const data = await apiLogin(username, password);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // Decode user info from token payload (base64)
        try {
            const payload = JSON.parse(atob(data.access.split('.')[1]));
            const userData = { id: payload.user_id, username };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch {
            setUser({ username });
        }
        setAccessToken(data.access);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        setAccessToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
