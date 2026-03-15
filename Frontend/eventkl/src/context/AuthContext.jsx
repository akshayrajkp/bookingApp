import { createContext, useContext, useState } from 'react';
import { login as loginApi } from '../api/userApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch {
            return null;
        }
    });

    const login = async (email, password) => {
        const res = await loginApi({ email, password });
        // your AuthResponse returns a token field — adjust if your field name differs
        const { token } = res.data;
        localStorage.setItem('token', token);
        setUser(JSON.parse(atob(token.split('.')[1])));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);