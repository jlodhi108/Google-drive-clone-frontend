import { apiRequest } from './client';
import type { AuthResponse, RegisterResponse, User } from '../types';

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiRequest<RegisterResponse>('/auth/register', { method: 'POST', body: { name, email, password }, skipAuth: true }),

  verifyOtp: (email: string, otp: string) =>
    apiRequest<AuthResponse>('/auth/verify-otp', { method: 'POST', body: { email, otp }, skipAuth: true }),

  resendOtp: (email: string) =>
    apiRequest<{ message: string }>('/auth/resend-otp', { method: 'POST', body: { email }, skipAuth: true }),

  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: { email, password }, skipAuth: true }),

  logout: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),

  getProfile: () => apiRequest<User>('/auth/profile'),

  updateProfile: (updates: { name?: string; email?: string }) =>
    apiRequest<{ message: string; user: User }>('/auth/profile', { method: 'PUT', body: updates }),

  deleteAccount: () => apiRequest<{ message: string }>('/auth/account', { method: 'DELETE' })
};
