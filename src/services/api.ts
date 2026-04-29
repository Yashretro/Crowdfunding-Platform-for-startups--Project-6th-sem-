import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add token to requests if it
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Projects API
export const projectService = {
  getAll: (filters?: any) => apiClient.get('/projects', { params: filters }),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};

// Users API
export const userService = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
};

// Investments API
export const investmentService = {
  getAll: () => apiClient.get('/investments'),
  getById: (id: string) => apiClient.get(`/investments/${id}`),
  create: (data: any) => apiClient.post('/investments', data),
  getProjectInvestments: (projectId: string) => apiClient.get(`/projects/${projectId}/investments`),
};

// Payments API
export const paymentService = {
  initiatePayment: (data: any) => apiClient.post('/payments/initiate', data),
  verifyPayment: (data: any) => apiClient.post('/payments/verify', data),
};
