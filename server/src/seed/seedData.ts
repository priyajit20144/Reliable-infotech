import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface SeedDataStore {
  users: any[];
  projects: any[];
  customRequests: any[];
  projectInquiries: any[];
  conversations: any[];
  messages: any[];
  notifications: any[];
  contactMessages: any[];
  passwordResets: any[];
  deletedProjectIds: string[];
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const PERSISTED_STORE_PATH = path.resolve(process.cwd(), 'server', 'data', 'persistedStore.json');
const PERSISTED_STORE_TMP_PATH = path.resolve('/tmp', 'persistedStore.json');
const PERSISTED_STORE_FALLBACK_PATH = path.resolve(process.cwd(), 'data', 'persistedStore.json');

const getPersistFilePath = (forWriting = false): string => {
  if (isServerless) {
    if (forWriting) return PERSISTED_STORE_TMP_PATH;
    if (fs.existsSync(PERSISTED_STORE_TMP_PATH)) return PERSISTED_STORE_TMP_PATH;
    if (fs.existsSync(PERSISTED_STORE_PATH)) return PERSISTED_STORE_PATH;
    return PERSISTED_STORE_TMP_PATH;
  }

  if (fs.existsSync(path.dirname(PERSISTED_STORE_PATH))) return PERSISTED_STORE_PATH;
  const fallbackDir = path.dirname(PERSISTED_STORE_FALLBACK_PATH);
  if (!fs.existsSync(fallbackDir)) {
    try {
      fs.mkdirSync(fallbackDir, { recursive: true });
    } catch {}
  }
  return PERSISTED_STORE_FALLBACK_PATH;
};

const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('Pass@1234', salt);
const clientHash = bcrypt.hashSync('Client@123456', salt);
const teamHash = bcrypt.hashSync('Team@123456', salt);

export const store: SeedDataStore = {
  passwordResets: [],
  deletedProjectIds: [],
  users: [
    {
      _id: 'usr_1791338343006',
      name: 'Priyajit Das',
      email: 'priyajitd80@gmail.com',
      passwordHash: adminHash,
      phone: '8768508264',
      avatar: '',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date('2026-10-07T01:59:03.008Z'),
    },
    {
      _id: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@reliableinfotech.io',
      passwordHash: clientHash,
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'USER',
      isActive: true,
      createdAt: new Date('2026-02-15T00:00:00.000Z'),
    },
    {
      _id: 'usr_client_legacy',
      name: 'Rahul Sharma',
      email: 'client@devcraft.io',
      passwordHash: clientHash,
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'USER',
      isActive: true,
      createdAt: new Date('2026-02-15T00:00:00.000Z'),
    },
    {
      _id: 'usr_team_1',
      name: 'Sarah Chen',
      email: 'team@reliableinfotech.io',
      passwordHash: teamHash,
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      role: 'TEAM_MEMBER',
      isActive: true,
      createdAt: new Date('2026-01-10T00:00:00.000Z'),
    },
    {
      _id: 'usr_team_legacy',
      name: 'Sarah Chen',
      email: 'team@devcraft.io',
      passwordHash: teamHash,
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      role: 'TEAM_MEMBER',
      isActive: true,
      createdAt: new Date('2026-01-10T00:00:00.000Z'),
    },
  ],
  projects: [],
  customRequests: [
    {
      _id: 'req_101',
      userId: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@reliableinfotech.io',
      phone: '+1 (555) 234-5678',
      businessName: 'Horizon Creative Studio',
      websiteType: 'Custom SaaS Platform',
      description: 'We need an interactive digital showcase platform for our creative design studio featuring real-time client revision tracking, custom proposal approval workflows, and interactive project galleries.',
      requiredFeatures: ['Custom Portfolio Showcase', 'Client Dashboard', 'Invoicing & Milestone Payments', 'Dark Mode UI'],
      budgetMin: 3000,
      budgetMax: 5000,
      deadline: '2026-11-30',
      referenceUrls: ['https://linear.app', 'https://stripe.com'],
      attachments: [],
      contactMethod: 'EMAIL',
      status: 'IN_DEVELOPMENT',
      priority: 'HIGH',
      assignedTo: 'Sarah Chen (Lead Architect)',
      createdAt: new Date('2026-03-01T10:00:00.000Z'),
      updatedAt: new Date('2026-03-05T14:30:00.000Z'),
    },
    {
      _id: 'req_102',
      userId: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@reliableinfotech.io',
      phone: '+1 (555) 234-5678',
      businessName: 'NextGen Mobility',
      websiteType: 'E-Commerce Platform',
      description: 'High-performance e-commerce website for luxury electric vehicle charging accessories with multi-currency checkout.',
      requiredFeatures: ['Product Filters', 'Stripe Integration', 'Shipping Calculator', 'Customer Reviews'],
      budgetMin: 2000,
      budgetMax: 3500,
      deadline: '2026-12-15',
      referenceUrls: ['https://apple.com'],
      attachments: [],
      contactMethod: 'EMAIL',
      status: 'UNDER_REVIEW',
      priority: 'MEDIUM',
      assignedTo: 'Reliable Info Tech Core Team',
      createdAt: new Date('2026-03-04T08:15:00.000Z'),
      updatedAt: new Date('2026-03-04T08:15:00.000Z'),
    },
    {
      _id: 'req_103',
      userId: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@reliableinfotech.io',
      phone: '+1 (555) 234-5678',
      businessName: 'Rahul Sharma Portfolio',
      websiteType: 'Personal Portfolio',
      description: 'Personal tech lead portfolio website with blog and GitHub repositories showcase.',
      requiredFeatures: ['Animated Hero', 'Responsive Layout', 'Contact Form', 'SEO Optimized'],
      budgetMin: 1000,
      budgetMax: 1800,
      deadline: '2026-09-30',
      referenceUrls: ['https://leerob.io'],
      attachments: [],
      contactMethod: 'EMAIL',
      status: 'COMPLETED',
      priority: 'LOW',
      assignedTo: 'Alex Rivera',
      createdAt: new Date('2026-02-10T12:00:00.000Z'),
      updatedAt: new Date('2026-03-01T16:00:00.000Z'),
    },
  ],
  projectInquiries: [
    {
      _id: 'inq_1',
      userId: 'usr_client_1',
      projectId: 'proj_1',
      name: 'Rahul Sharma',
      email: 'client@reliableinfotech.io',
      message: 'Hi Reliable Info Tech team, we would love to acquire or customize ApexCloud for our internal Kubernetes clusters. What is the delivery turnaround?',
      status: 'CONTACTED',
      createdAt: new Date('2026-03-02T11:20:00.000Z'),
      updatedAt: new Date('2026-03-02T15:00:00.000Z'),
    },
  ],
  conversations: [
    {
      _id: 'conv_1',
      requestId: 'req_101',
      clientName: 'Rahul Sharma',
      clientEmail: 'client@reliableinfotech.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'Horizon Creative Studio Showcase',
      participants: ['usr_client_1', 'usr_team_1', 'usr_admin_1'],
      lastMessage: 'Awesome, can we schedule a demo call tomorrow at 3 PM?',
      time: '12m ago',
      unreadCount: 2,
      online: true,
      createdAt: new Date('2026-03-01T10:30:00.000Z'),
      updatedAt: new Date(Date.now() - 12 * 60 * 1000),
    },
    {
      _id: 'conv_2',
      requestId: 'req_102',
      clientName: 'Priya Sharma',
      clientEmail: 'priya@nextgenmobility.com',
      clientAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'E-commerce EV Charging Architecture',
      participants: ['usr_client_2', 'usr_admin_1'],
      lastMessage: 'Stripe currency rates look spotless. Approved to deploy.',
      time: '2h ago',
      unreadCount: 1,
      online: true,
      createdAt: new Date('2026-03-02T08:00:00.000Z'),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      _id: 'conv_3',
      requestId: 'req_103',
      clientName: 'Amit Verma',
      clientEmail: 'amit@apexlogistics.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      projectSubject: 'Project #PRJ-003 Logistics Gateway',
      participants: ['usr_client_3', 'usr_admin_1'],
      lastMessage: 'Can you please send over the latest staging preview URL?',
      time: '4h ago',
      unreadCount: 2,
      online: false,
      createdAt: new Date('2026-03-02T07:00:00.000Z'),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ],
  messages: [
    {
      _id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_client_1',
      senderName: 'Rahul Sharma',
      senderRole: 'USER',
      message: 'Hi Reliable Info Tech Team! We just reviewed the first sprint milestone for our portfolio platform.',
      attachments: [],
      isRead: true,
      createdAt: new Date('2026-03-05T10:15:00.000Z'),
    },
    {
      _id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'usr_admin_1',
      senderName: 'Alex Rivera',
      senderRole: 'ADMIN',
      message: 'Great to hear Rahul! Sarah Chen has also finalized the high-availability database schema and API endpoints.',
      attachments: [],
      isRead: true,
      createdAt: new Date('2026-03-05T10:22:00.000Z'),
    },
    {
      _id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'usr_client_1',
      senderName: 'Rahul Sharma',
      senderRole: 'USER',
      message: 'Awesome, can we schedule a demo call tomorrow at 3 PM?',
      attachments: [],
      isRead: false,
      createdAt: new Date('2026-03-05T10:30:00.000Z'),
    },
    {
      _id: 'msg_2_1',
      conversationId: 'conv_2',
      senderId: 'usr_client_2',
      senderName: 'Priya Sharma',
      senderRole: 'USER',
      message: 'Stripe currency rates look spotless. Approved to deploy.',
      attachments: [],
      isRead: false,
      createdAt: new Date('2026-03-05T08:45:00.000Z'),
    },
    {
      _id: 'msg_3_1',
      conversationId: 'conv_3',
      senderId: 'usr_client_3',
      senderName: 'Amit Verma',
      senderRole: 'USER',
      message: 'Can you please send over the latest staging preview URL?',
      attachments: [],
      isRead: false,
      createdAt: new Date('2026-03-05T07:20:00.000Z'),
    },
  ],
  notifications: [
    {
      _id: 'notif_1',
      userId: 'usr_client_1',
      title: 'Status Update: In Progress',
      message: 'Your custom request "Horizon Creative Studio" has advanced to IN_DEVELOPMENT.',
      type: 'REQUEST_STATUS',
      referenceId: 'req_101',
      isRead: false,
      createdAt: new Date('2026-03-05T14:35:00.000Z'),
    },
    {
      _id: 'notif_2',
      userId: 'usr_client_1',
      title: 'New Team Message',
      message: 'Sarah Chen sent an update regarding your project wireframes.',
      type: 'MESSAGE',
      referenceId: 'req_101',
      isRead: false,
      createdAt: new Date('2026-03-05T14:31:00.000Z'),
    },
    {
      _id: 'notif_3',
      userId: 'usr_client_1',
      title: 'Project Delivered',
      message: 'Your project "Rahul Sharma Portfolio" was successfully delivered and launched.',
      type: 'PROJECT_COMPLETED',
      referenceId: 'req_103',
      isRead: true,
      createdAt: new Date('2026-03-01T16:00:00.000Z'),
    },
  ],
  contactMessages: [],
};

// =========================================================================
// LOCAL STORAGE PERSISTENCE LAYER FOR RESILIENT HYBRID OFFLINE/FALLBACK RUNS
// =========================================================================
export const persistStoreState = () => {
  try {
    const filePath = getPersistFilePath(true);
    const dataToSave = {
      projects: store.projects,
      deletedProjectIds: Array.from(new Set(store.deletedProjectIds || [])),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[SeedStore] Failed to write persisted store to disk:', (err as Error).message);
  }
};

export const initPersistedStore = () => {
  try {
    const filePath = getPersistFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.deletedProjectIds)) {
        store.deletedProjectIds = Array.from(
          new Set([...(store.deletedProjectIds || []), ...parsed.deletedProjectIds])
        );
      }
      if (Array.isArray(parsed.projects)) {
        // Filter out any explicitly deleted projects
        const deletedSet = new Set(store.deletedProjectIds);
        store.projects = parsed.projects.filter(
          (p: any) => !deletedSet.has(p._id) && !deletedSet.has(p.slug)
        );
      }
    }
  } catch (err) {
    console.warn('[SeedStore] Failed to load persisted store from disk:', (err as Error).message);
  }
};

// Auto-initialize from disk immediately upon module load
initPersistedStore();

