import { apiRequest } from './api';
import { Conversation, Message } from '../types';

export const messageService = {
  async getConversations() {
    return apiRequest<{ success: boolean; data: any[] }>('/conversations');
  },

  async getMessages(conversationId: string) {
    return apiRequest<{ success: boolean; data: any[] }>(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, message: string) {
    return apiRequest<{ success: boolean; data: any }>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async markAsRead(conversationId: string) {
    return apiRequest<{ success: boolean; message: string }>(`/conversations/${conversationId}/read`, {
      method: 'PATCH',
    });
  },

  async createConversation(data: { clientEmail?: string; clientName?: string; projectSubject?: string; message: string }) {
    return apiRequest<{ success: boolean; data: any }>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
