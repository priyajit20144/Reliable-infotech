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

const PERSISTED_STORE_PATH = path.resolve(process.cwd(), 'server', 'data', 'persistedStore.json');
const PERSISTED_STORE_FALLBACK_PATH = path.resolve(process.cwd(), 'data', 'persistedStore.json');

const getPersistFilePath = (): string => {
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
const adminHash = bcrypt.hashSync('Admin@123456', salt);
const clientHash = bcrypt.hashSync('Client@123456', salt);
const teamHash = bcrypt.hashSync('Team@123456', salt);

export const store: SeedDataStore = {
  passwordResets: [],
  deletedProjectIds: [],
  users: [
    {
      _id: 'usr_admin_1',
      name: 'Alex Rivera',
      email: 'admin@devcraft.io',
      passwordHash: adminHash,
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      _id: 'usr_client_1',
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
      email: 'team@devcraft.io',
      passwordHash: teamHash,
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      role: 'TEAM_MEMBER',
      isActive: true,
      createdAt: new Date('2026-01-10T00:00:00.000Z'),
    },
  ],
  projects: [
    {
      _id: 'proj_1',
      title: 'ApexCloud — Multi-Cloud DevOps Analytics',
      slug: 'apexcloud-devops-analytics',
      shortDescription: 'Enterprise real-time infrastructure monitoring with distributed tracing, latency forecasting, and automatic incident mitigation.',
      description: 'ApexCloud provides unified observability across AWS, GCP, and Kubernetes clusters. Features microsecond telemetry streaming, automated canary rollouts, and anomaly detection.',
      category: 'Cloud / DevOps',
      technologies: ['React', 'TypeScript', 'Node.js', 'Go', 'GraphQL', 'Tailwind CSS', 'Docker'],
      features: [
        'Live Kubernetes cluster topology mapping',
        'Real-time streaming telemetry with WebSocket integration',
        'Automated rollbacks on anomaly trigger thresholds',
        'Granular role-based team workspace permissions',
      ],
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      demoUrl: 'https://apexcloud.demo.devcraft.io',
      githubUrl: 'https://github.com/devcraft-org/apexcloud',
      price: 4800,
      status: 'PUBLISHED',
      featured: true,
      createdBy: 'usr_admin_1',
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
    },
    {
      _id: 'proj_2',
      title: 'LuminaPay — Global Fintech & Escrow Gateway',
      slug: 'luminapay-global-fintech',
      shortDescription: 'Next-generation borderless cross-currency settlement engine with multi-party escrow workflows and compliance telemetry.',
      description: 'Engineered for international merchant networks, LuminaPay features instant currency conversion, automated KYC/AML verification pipelines, and dual-authorization smart settlement.',
      category: 'Fintech / Payments',
      technologies: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Tailwind CSS'],
      features: [
        'Instant multi-currency exchange with sub-second rates',
        'Automated escrow milestone releases',
        'Comprehensive audit log export and tax reporting',
        'Stripe & crypto on-ramp dual integration',
      ],
      images: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      demoUrl: 'https://luminapay.demo.devcraft.io',
      githubUrl: 'https://github.com/devcraft-org/luminapay',
      price: 5400,
      status: 'PUBLISHED',
      featured: true,
      createdBy: 'usr_admin_1',
      createdAt: new Date('2026-02-10T00:00:00.000Z'),
    },
    {
      _id: 'proj_3',
      title: 'SynapseAI — Cognitive Knowledge Graph & Copilot',
      slug: 'synapse-ai-copilot',
      shortDescription: 'Enterprise AI retrieval engine transforming unstructured document silos into interactive queryable knowledge graphs.',
      description: 'SynapseAI harnesses vector embeddings, semantic reranking, and private LLM execution to let teams explore internal documentation, contracts, and codebase architectures with zero data leakage.',
      category: 'Artificial Intelligence',
      technologies: ['React', 'Python', 'FastAPI', 'Node.js', 'Vector DB', 'Tailwind CSS'],
      features: [
        'Semantic neural search over PDFs, Word documents, and Git repos',
        'Interactive 3D graph visualizer of interrelated concepts',
        'SOC-2 compliant zero-retention private queries',
        'Custom fine-tuned context agents for development teams',
      ],
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      demoUrl: 'https://synapse.demo.devcraft.io',
      githubUrl: 'https://github.com/devcraft-org/synapse-ai',
      price: 6200,
      status: 'PUBLISHED',
      featured: true,
      createdBy: 'usr_admin_1',
      createdAt: new Date('2026-02-18T00:00:00.000Z'),
    },
    {
      _id: 'proj_4',
      title: 'VerveCommerce — Headless Luxury Retail Platform',
      slug: 'verve-commerce-luxury-retail',
      shortDescription: 'Ultra-fast headless luxury lifestyle e-commerce store with dynamic 3D product previews and localized multi-country checkout.',
      description: 'VerveCommerce was engineered for sub-second page transitions, dynamic inventory reservation, personalized product configuration, and omnichannel POS synchronization.',
      category: 'E-Commerce',
      technologies: ['React', 'Express', 'MongoDB', 'Framer Motion', 'Tailwind CSS'],
      features: [
        'Lightning-fast catalog navigation with instant instant filtering',
        'Interactive 360-degree garment and accessory viewers',
        'Multi-currency checkout with local tax calculations',
        'Abandoned cart recovery automation',
      ],
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      demoUrl: 'https://verve.demo.devcraft.io',
      githubUrl: 'https://github.com/devcraft-org/verve-commerce',
      price: 3900,
      status: 'PUBLISHED',
      featured: false,
      createdBy: 'usr_admin_1',
      createdAt: new Date('2026-02-25T00:00:00.000Z'),
    },
  ],
  customRequests: [
    {
      _id: 'req_101',
      userId: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@devcraft.io',
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
      email: 'client@devcraft.io',
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
      assignedTo: 'DevCraft Core Team',
      createdAt: new Date('2026-03-04T08:15:00.000Z'),
      updatedAt: new Date('2026-03-04T08:15:00.000Z'),
    },
    {
      _id: 'req_103',
      userId: 'usr_client_1',
      name: 'Rahul Sharma',
      email: 'client@devcraft.io',
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
      email: 'client@devcraft.io',
      message: 'Hi DevCraft team, we would love to acquire or customize ApexCloud for our internal Kubernetes clusters. What is the delivery turnaround?',
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
      clientEmail: 'client@devcraft.io',
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
      message: 'Hi DevCraft Team! We just reviewed the first sprint milestone for our portfolio platform.',
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
    const filePath = getPersistFilePath();
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

