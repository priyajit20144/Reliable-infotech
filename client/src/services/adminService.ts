import { apiRequest } from './api';
import { Project, CustomRequest, User, ProjectInquiry } from '../types';

export const adminService = {
  async getDashboardStats() {
    return apiRequest<{
      success: boolean;
      stats: {
        totalUsers: number;
        totalProjects: number;
        newRequests: number;
        activeProjects: number;
        completedProjects: number;
        totalRevenue: number;
      };
      recentRequests: CustomRequest[];
    }>('/admin/dashboard');
  },

  async getAllUsers() {
    return apiRequest<{ success: boolean; count: number; data: User[] }>('/admin/users');
  },

  async getAllRequests(params?: { status?: string; priority?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ success: boolean; count: number; data: CustomRequest[] }>(`/admin/requests${qs}`);
  },

  async deleteRequest(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/admin/requests/${id}`, {
      method: 'DELETE',
    });
  },

  async updateRequestStatus(id: string, status: string, note?: string) {
    return apiRequest<{ success: boolean; data: CustomRequest }>(`/admin/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  async assignRequestTeam(id: string, assignedTo: string) {
    return apiRequest<{ success: boolean; data: CustomRequest }>(`/admin/requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
  },

  async createProject(data: Partial<Project>) {
    return apiRequest<{ success: boolean; data: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string, data: Partial<Project>) {
    return apiRequest<{ success: boolean; data: Project }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async getAllInquiries() {
    return apiRequest<{ success: boolean; count: number; data: ProjectInquiry[] }>('/admin/inquiries');
  },
};
