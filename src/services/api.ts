import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lightweight DTOs used for requests — responses are left untyped to avoid
// cross-file type collisions with local page component types.
export type ProjectFilters = Record<string, unknown>;
export interface ProjectCreate {
  title: string;
  description?: string;
  goal?: number;
  image?: string;
  category?: string;
  daysLeft?: number;
  featured?: boolean;
}

export interface RegisterData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  userType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export type ProfileUpdate = Partial<{ name: string; bio: string; email: string }>;

export interface InvestmentCreate {
  projectId: string;
  projectTitle?: string;
  amount: number;
  status?: 'pending' | 'confirmed' | 'failed';
}

export interface PaymentInitiate {
  projectId: string;
  amount: number;
}

export interface PaymentVerify {
  paymentId: string;
  amount: number;
}

export const projectService = {
  getAll: (filters?: ProjectFilters) => apiClient.get<unknown>('/projects', { params: filters }),
  getById: (id: string) => apiClient.get<unknown>(`/projects/${id}`),
  create: (data: ProjectCreate) => apiClient.post('/projects', data),
  update: (id: string, data: ProjectCreate) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};

export const userService = {
  register: (data: RegisterData) => apiClient.post('/auth/signup', data),
  login: (data: LoginData) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: ProfileUpdate) => apiClient.put('/users/profile', data),
};

export const investmentService = {
  getAll: () => apiClient.get('/investments'),
  getById: (id: string) => apiClient.get(`/investments/${id}`),
  create: (data: InvestmentCreate) => apiClient.post('/investments', data),
  getProjectInvestments: (projectId: string) => apiClient.get(`/projects/${projectId}/investments`),
};

export const paymentService = {
  initiatePayment: (data: PaymentInitiate) => apiClient.post('/payments/initiate', data),
  verifyPayment: (data: PaymentVerify) => apiClient.post('/payments/verify', data),
};
