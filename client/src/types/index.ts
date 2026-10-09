export type UserRole = 'USER' | 'TEAM_MEMBER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  features: string[];
  images: string[];
  thumbnail: string;
  demoUrl?: string;
  githubUrl?: string;
  price?: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CustomRequestStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'REQUIREMENTS'
  | 'QUOTATION'
  | 'APPROVED'
  | 'IN_DEVELOPMENT'
  | 'TESTING'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface CustomRequest {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  websiteType: string;
  description: string;
  requiredFeatures: string[];
  budgetMin: number;
  budgetMax: number;
  deadline?: string;
  referenceUrls: string[];
  attachments: string[];
  contactMethod: 'EMAIL' | 'PHONE' | 'WHATSAPP';
  status: CustomRequestStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInquiry {
  _id: string;
  userId?: string;
  projectId: string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
  createdAt: string;
}

export interface Conversation {
  _id: string;
  id?: string;
  requestId?: string;
  participants: string[];
  clientName?: string;
  clientEmail?: string;
  clientAvatar?: string;
  projectSubject?: string;
  lastMessage?: string;
  unreadCount?: number;
  online?: boolean;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  text?: string;
  time?: string;
  isMe?: boolean;
  attachments?: string[];
  isRead: boolean;
  createdAt?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INQUIRY' | 'REQUEST_STATUS' | 'TEAM_ASSIGNED' | 'MESSAGE' | 'PROJECT_COMPLETED' | 'SYSTEM';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}
