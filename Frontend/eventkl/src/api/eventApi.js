import api from './axios';

// GET /api/events  →  List<Event>
export const getAllEvents = () => api.get('/events');

// GET /api/events/{eventId}/availability  →  Boolean
export const checkAvailability = (eventId) => api.get(`/events/${eventId}/availability`);

// POST /api/events/{eventId}/reserve  →  "Seat reserved"
export const reserveSeat = (eventId) => api.post(`/events/${eventId}/reserve`);

// POST /api/events  →  Event  (admin use)
export const createEvent = (data) => api.post('/events', data);