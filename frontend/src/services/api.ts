import axios from 'axios';
import type { Category, Complaint, DashboardStats, Department, User } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const complaintApi = {
  getAll: async (filters?: { status?: string; categoryId?: number; priority?: string; search?: string }): Promise<Complaint[]> => {
    const res = await api.get('/complaints', { params: filters });
    return res.data;
  },
  getById: async (id: number): Promise<Complaint> => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },
  create: async (formData: FormData): Promise<Complaint> => {
    const res = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  updateStatus: async (id: number, data: { status: string; remarks?: string }): Promise<Complaint> => {
    const res = await api.put(`/complaints/${id}/status`, data);
    return res.data;
  },
  updatePriority: async (id: number, data: { priority: string }): Promise<Complaint> => {
    const res = await api.put(`/complaints/${id}/priority`, data);
    return res.data;
  },
  assign: async (id: number, data: { departmentId: number; assignedOfficer?: string; remarks?: string }): Promise<Complaint> => {
    const res = await api.post(`/complaints/${id}/assign`, data);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/complaints/${id}`);
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data;
  },
};

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const res = await api.get('/departments');
    return res.data;
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/statistics');
    return res.data;
  },
};

export default api;
