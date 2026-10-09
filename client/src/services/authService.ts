import { apiRequest } from './api';
import { User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return apiRequest<{ success: boolean; token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }) {
    return apiRequest<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
  },

  async getMe() {
    return apiRequest<{ success: boolean; user: User }>('/auth/me');
  },

  async updateProfile(data: { name?: string; phone?: string; avatar?: string; password?: string }) {
    return apiRequest<{ success: boolean; user: User; message: string }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
