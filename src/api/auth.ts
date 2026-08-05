import { apiRequest } from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: { name, email, password }, skipAuth: true }),

  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: { email, password }, skipAuth: true }),

  logout: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),

  getProfile: () => apiRequest<User>('/auth/profile'),

  updateProfile: (updates: { name?: string; email?: string }) =>
    apiRequest<{ message: string; user: User }>('/auth/profile', { method: 'PUT', body: updates }),

  deleteAccount: () => apiRequest<{ message: string }>('/auth/account', { method: 'DELETE' })
};
