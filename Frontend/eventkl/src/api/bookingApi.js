import api from './axios';

// POST /api/bookings
export const createBooking = (data) => api.post('/bookings', data);

// DELETE /api/bookings/{id}
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// GET /api/bookings/user/{userId}
export const getMyBookings = (userId) => api.get(`/bookings/user/${userId}`);