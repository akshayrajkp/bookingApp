import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { login as loginApi, getMe as getMeApi } from '../api/userApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  });

  // Silently resolve full user profile (with ID) if missing from token — runs once on mount only
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!hasFetchedRef.current && user && !user.id) {
      hasFetchedRef.current = true;
      getMeApi()
        .then(res => setUser(res.data))
        .catch(err => console.error('Silent profile fetch failed:', err));
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token } = res.data;
    sessionStorage.setItem('token', token);
    const decoded = JSON.parse(atob(token.split('.')[1]));
    // If the new token already has ID (from my previous fix), great.
    // If not, the useEffect above will catch it.
    setUser(decoded);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);