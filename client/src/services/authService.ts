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

  async forgotPassword(email: string) {
    return apiRequest<{
      success: boolean;
      message: string;
      resetToken: string;
      email: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyResetOtp(data: { email: string; otp: string; resetToken: string }) {
    return apiRequest<{
      success: boolean;
      message: string;
      verificationToken: string;
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: { email: string; newPassword: string; verificationToken: string }) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
