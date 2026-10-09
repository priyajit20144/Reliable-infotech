import { apiRequest } from './api';
import { CustomRequest } from '../types';

export const requestService = {
  async createCustomRequest(data: Partial<CustomRequest>) {
    return apiRequest<{ success: boolean; message: string; data: CustomRequest }>('/custom-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyRequests() {
    return apiRequest<{ success: boolean; count: number; data: CustomRequest[] }>('/custom-requests/my');
  },

  async getRequestById(id: string) {
    return apiRequest<{ success: boolean; data: CustomRequest }>(`/custom-requests/${id}`);
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ success: boolean; file: { name: string; url: string; size: number } }>('/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
