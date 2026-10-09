import { apiRequest } from './api';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications() {
    return apiRequest<{ success: boolean; count: number; unreadCount: number; data: Notification[] }>(
      '/notifications'
    );
  },

  async markAsRead(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead() {
    return apiRequest<{ success: boolean; message: string }>('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};
