import api from './axios';

// POST /api/auth/register
// Body: { firstName, lastName, email, password }
// Returns: string message
export const register = (data) => api.post('/auth/register', data);

// POST /api/auth/login
// Body: { email, password }
// Returns: AuthResponse { token, ... }
export const login = (data) => api.post('/auth/login', data);