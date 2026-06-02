import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


// =========================
// TOKEN DECODER UTILITY
// =========================

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};


// =========================
// AUTH API
// =========================

export const authAPI = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  register: (userData) =>
    api.post('/auth/register', userData),

  me: () =>
    api.get('/auth/me'),
};


// =========================
// ROUTES API
// =========================

export const routesAPI = {
  getAll: () =>
    api.get('/routes'),

  getById: (id) =>
    api.get(`/routes/${id}`),

  create: (data) =>
    api.post('/routes', data),

  update: (id, data) =>
    api.put(`/routes/${id}`, data),

  delete: (id) =>
    api.delete(`/routes/${id}`),
};


// =========================
// SEARCH API
// =========================

export const searchAPI = {
  searchRoutes: (from, to) =>
    api.get(`/routes/search?origin=${from}&destination=${to}`),
};


// =========================
// TICKETS API
// =========================

export const ticketsAPI = {
  book: (data) =>
    api.post('/tickets/book', data),

  getPassengerTickets: (id) =>
    api.get(`/tickets/passenger/${id}`),

  getUserTickets: (id) =>
    api.get(`/tickets/user/${id}`),

  getAll: () =>
    api.get('/tickets'),

  cancel: (id) =>
    api.delete(`/tickets/cancel/${id}`),
};


// =========================
// BUSES API
// =========================

export const busesAPI = {
  getAll: () =>
    api.get('/buses'),

  getById: (id) =>
    api.get(`/buses/${id}`),

  create: (data) =>
    api.post('/buses', data),

  update: (id, data) =>
    api.put(`/buses/${id}`, data),

  delete: (id) =>
    api.delete(`/buses/${id}`),
};


// =========================
// SCHEDULES API
// =========================

export const schedulesAPI = {
  getAll: () =>
    api.get('/schedules'),

  getByRoute: (routeId) =>
    api.get(`/schedules/route/${routeId}`),

  create: (data) =>
    api.post('/schedules', data),

  update: (id, data) =>
    api.put(`/schedules/${id}`, data),

  delete: (id) =>
    api.delete(`/schedules/${id}`),
};


// =========================
// TRACKING API
// =========================

export const trackingAPI = {
  updateLocation: (data) =>
    api.post('/tracking/update', data),

  getBusLocation: (busId) =>
    api.get(`/tracking/bus/${busId}`),

  getAllLive: () =>
    api.get('/tracking'),
};


// =========================
// PAYMENTS API
// =========================

export const paymentsAPI = {
  pay: (data) =>
    api.post('/payments/pay', data),

  getAll: () =>
    api.get('/payments'),

  getByPassenger: (id) =>
    api.get(`/payments/passenger/${id}`),
};


// =========================
// USSD API
// =========================

export const ussdAPI = {
  process: (data) =>
    api.post('/ussd', data),
};


// =========================
// DRIVERS API
// =========================

export const driversAPI = {
  getAll: () =>
    api.get('/drivers'),

  getById: (id) =>
    api.get(`/drivers/${id}`),

  getMySchedules: (driverId) =>
    api.get(`/schedules/driver/${driverId}`),
};


// =========================
// ADMIN API
// =========================

export const adminAPI = {
  getUsers: () =>
    api.get('/admin/users'),

  getBuses: () =>
    api.get('/admin/buses'),

  createBus: (data) =>
    api.post('/admin/buses', data),

  updateBus: (id, data) =>
    api.put(`/admin/buses/${id}`, data),

  deleteBus: (id) =>
    api.delete(`/admin/buses/${id}`),

  getRoutes: () =>
    api.get('/admin/routes'),

  createRoute: (data) =>
    api.post('/admin/routes', data),

  updateRoute: (id, data) =>
    api.put(`/admin/routes/${id}`, data),

  deleteRoute: (id) =>
    api.delete(`/admin/routes/${id}`),

  getSchedules: () =>
    api.get('/admin/schedules'),

  createSchedule: (data) =>
    api.post('/admin/schedules', data),

  getBookings: () =>
    api.get('/admin/bookings'),

  getDrivers: () =>
    api.get('/admin/drivers'),
};


// =========================
// STATS API
// =========================

export const statsAPI = {
  getPassengerStats: (passengerId) =>
    api.get(`/stats/passenger/${passengerId}`),

  getAdminStats: () =>
    api.get('/stats/admin'),

  getDriverStats: (driverId) =>
    api.get(`/stats/driver/${driverId}`),
};
