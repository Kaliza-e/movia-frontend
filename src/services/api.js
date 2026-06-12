import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token on the api instance
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.url, 'Token:', token ? 'present' : 'missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
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
    const url = error.config?.url || '';
    // Prevent aggressive redirects on specific data endpoints where the backend might mask 500s/404s as 401s
    if (error.response?.status === 401 && !url.includes('/schedules') && !url.includes('/tickets') && !url.includes('/admin/schedules')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
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
  searchRoutes: (from, to, date) => {
    const params = new URLSearchParams({ from, to });
    if (date) params.append('date', date);
    return api.get(`/search?${params.toString()}`);
  },
};


// =========================
// TICKETS API
// =========================

export const ticketsAPI = {
  book: (data) =>
    api.post('/tickets/book', {
      userId: data.userId ?? data.passengerId,
      scheduleId: data.scheduleId,
      seatNumber: data.seatNumber,
    }),

  getMyTickets: () =>
    api.get('/tickets/my-tickets'),

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

  getBookedSeats: (scheduleId) =>
    api.get(`/schedules/${scheduleId}/booked-seats`),

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

  create: (data) =>
    api.post('/drivers', data),

  update: (id, data) =>
    api.put(`/drivers/${id}`, data),

  delete: (id) =>
    api.delete(`/drivers/${id}`),


  getMySchedules: (userId) =>
    api.get(`/drivers/user/${userId}/schedules`),
};




export const adminAPI = {
  getUsers: () =>
    api.get('/admin/users'),

  getBuses: () =>
    api.get('/admin/buses'),
  // Create a new schedule (admin side)
  createSchedule: (data) =>
    api.post('/admin/schedules', data),

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
