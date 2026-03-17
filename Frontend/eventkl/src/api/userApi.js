import api from './axios';

// POST /api/auth/register
// Body: { firstName, lastName, email, password }
// Returns: string message
export const register = (data) => api.post('/auth/register', data);

// POST /api/auth/login
// Body: { email, password }
// Returns: AuthResponse { token, ... }
export const login = (data) => api.post('/auth/login', data);

// GET /api/auth/me
// Returns: Full User object { id, firstName, lastName, email, role }
export const getMe = () => api.get('/auth/me');