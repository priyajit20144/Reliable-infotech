import { apiRequest } from './api';
import { Project, ProjectInquiry } from '../types';

export const projectService = {
  async getProjects(params?: { category?: string; search?: string; featured?: boolean; tech?: string }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.tech) query.append('tech', params.tech);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ success: boolean; count: number; data: Project[] }>(`/projects${qs}`);
  },

  async getProjectById(id: string) {
    return apiRequest<{ success: boolean; data: Project }>(`/projects/${id}`);
  },

  async createInquiry(data: { projectId: string; name: string; email: string; message: string }) {
    return apiRequest<{ success: boolean; message: string; data: ProjectInquiry }>('/project-inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyInquiries() {
    return apiRequest<{ success: boolean; count: number; data: ProjectInquiry[] }>('/project-inquiries/my');
  },
};
