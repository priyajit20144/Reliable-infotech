import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { UserModel } from '../models/User.js';
import { ProjectModel } from '../models/Project.js';
import { CustomRequestModel } from '../models/CustomRequest.js';
import { ProjectInquiryModel } from '../models/ProjectInquiry.js';
import { NotificationModel } from '../models/Notification.js';
import { ContactMessageModel } from '../models/ContactMessage.js';
import { isConnectedToMongo } from '../config/db.js';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    if (isConnectedToMongo) {
      const [usersCount, projectsCount, requests] = await Promise.all([
        UserModel.countDocuments(),
        ProjectModel.countDocuments(),
        CustomRequestModel.find().sort({ createdAt: -1 }),
      ]);

      const newRequests = requests.filter((r) => r.status === 'NEW').length;
      const activeProjects = requests.filter((r) =>
        ['APPROVED', 'IN_DEVELOPMENT', 'TESTING'].includes(r.status)
      ).length;
      const completedProjects = requests.filter((r) =>
        ['COMPLETED', 'DELIVERED'].includes(r.status)
      ).length;

      return res.json({
        success: true,
        stats: {
          totalUsers: usersCount,
          totalProjects: projectsCount,
          newRequests,
          activeProjects,
          completedProjects,
          totalRevenue: 28500,
        },
        recentRequests: requests.slice(0, 5),
      });
    }

    const usersCount = store.users.length;
    const projectsCount = store.projects.length;
    const requests = store.customRequests;

    const newRequests = requests.filter((r) => r.status === 'NEW').length;
    const activeProjects = requests.filter((r) =>
      ['APPROVED', 'IN_DEVELOPMENT', 'TESTING'].includes(r.status)
    ).length;
    const completedProjects = requests.filter((r) =>
      ['COMPLETED', 'DELIVERED'].includes(r.status)
    ).length;

    return res.json({
      success: true,
      stats: {
        totalUsers: usersCount,
        totalProjects: projectsCount,
        newRequests,
        activeProjects,
        completedProjects,
        totalRevenue: 28500,
      },
      recentRequests: requests.slice(0, 5),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    if (isConnectedToMongo) {
      const users = await UserModel.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    }
    const safeUsers = store.users.map(({ passwordHash, ...rest }) => rest);
    return res.json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const { status, priority, search, q } = req.query;
    const searchTerm = (typeof search === 'string' ? search : typeof q === 'string' ? q : '').trim();

    if (isConnectedToMongo) {
      const query: any = {};
      if (status && status !== 'ALL') query.status = status;
      if (priority && priority !== 'ALL') query.priority = priority;
      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { businessName: { $regex: searchTerm, $options: 'i' } },
          { websiteType: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ];
      }

      const requests = await CustomRequestModel.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    }

    let list = store.customRequests;
    if (status && status !== 'ALL') {
      list = list.filter((r) => r.status === status);
    }
    if (priority && priority !== 'ALL') {
      list = list.filter((r) => r.priority === priority);
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.businessName?.toLowerCase().includes(s) ||
          r.websiteType?.toLowerCase().includes(s) ||
          r.description?.toLowerCase().includes(s)
      );
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const deleted = await CustomRequestModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Request not found.' });
      }
      return res.json({ success: true, message: 'Request deleted successfully.' });
    }

    const idx = store.customRequests.findIndex((r) => r._id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    store.customRequests.splice(idx, 1);
    return res.json({ success: true, message: 'Request deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    let reqItem: any;
    if (isConnectedToMongo) {
      reqItem = await CustomRequestModel.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found.' });

      await NotificationModel.create({
        userId: reqItem.userId,
        title: `Request Status Updated: ${status}`,
        message: note || `Your custom request "${reqItem.businessName || reqItem.websiteType}" has been updated to ${status}.`,
        type: 'REQUEST_STATUS',
        referenceId: id,
      });

      return res.json({ success: true, data: reqItem });
    }

    reqItem = store.customRequests.find((r) => r._id === id);
    if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found.' });

    reqItem.status = status;
    reqItem.updatedAt = new Date();

    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: reqItem.userId,
      title: `Request Status Updated: ${status}`,
      message: note || `Your custom request "${reqItem.businessName || reqItem.websiteType}" has been updated to ${status}.`,
      type: 'REQUEST_STATUS',
      referenceId: id,
      isRead: false,
      createdAt: new Date(),
    });

    return res.json({ success: true, data: reqItem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const assignRequestTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ success: false, message: 'Assigned team member name is required.' });
    }

    let reqItem: any;
    if (isConnectedToMongo) {
      reqItem = await CustomRequestModel.findByIdAndUpdate(
        id,
        { assignedTo, updatedAt: new Date() },
        { new: true }
      );
      if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found.' });

      await NotificationModel.create({
        userId: reqItem.userId,
        title: 'Team Member Assigned',
        message: `${assignedTo} has been assigned to oversee your project.`,
        type: 'TEAM_ASSIGNED',
        referenceId: id,
      });

      return res.json({ success: true, data: reqItem });
    }

    reqItem = store.customRequests.find((r) => r._id === id);
    if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found.' });

    reqItem.assignedTo = assignedTo;
    reqItem.updatedAt = new Date();

    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: reqItem.userId,
      title: 'Team Member Assigned',
      message: `${assignedTo} has been assigned to oversee your project.`,
      type: 'TEAM_ASSIGNED',
      referenceId: id,
      isRead: false,
      createdAt: new Date(),
    });

    return res.json({ success: true, data: reqItem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInquiries = async (_req: Request, res: Response) => {
  try {
    if (isConnectedToMongo) {
      const inqs = await ProjectInquiryModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: inqs.length, data: inqs });
    }
    return res.json({ success: true, count: store.projectInquiries.length, data: store.projectInquiries });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
