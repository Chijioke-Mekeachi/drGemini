import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Set auth header for subsequent requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Fetch user profile
                    const response = await api.get('/auth/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to authenticate with token:', error);
                    localStorage.removeItem('authToken');
                }
            }
            setIsLoading(false);
        };
        loadUserFromToken();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
    };

    const signup = async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateUserBalance = (newBalance) => {
        if (user) {
            setUser(prevUser => ({ ...prevUser, credits: newBalance }));
        }
    };

    const value = {
        user,
        isLoading,
        login,
        signup,
        logout,
        updateUserBalance
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};