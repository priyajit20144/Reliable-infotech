import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { ProjectInquiryModel } from '../models/ProjectInquiry.js';
import { NotificationModel } from '../models/Notification.js';
import { isConnectedToMongo } from '../config/db.js';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { projectId, name, email, message } = req.body;
    if (!projectId || !name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const userId = req.user?.id || undefined;

    const newInquiry = {
      _id: `inq_${Date.now()}`,
      userId,
      projectId,
      name,
      email,
      message,
      status: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isConnectedToMongo) {
      const created = await ProjectInquiryModel.create(newInquiry);
      await NotificationModel.create({
        userId: 'usr_admin_1',
        title: 'New Project Acquisition Inquiry',
        message: `${name} (${email}) sent an inquiry for project ID ${projectId}.`,
        type: 'INQUIRY',
        referenceId: created._id.toString(),
      });
      return res.status(201).json({ success: true, message: 'Inquiry received. We will contact you shortly.', data: created });
    }

    store.projectInquiries.unshift(newInquiry);
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      title: 'New Project Acquisition Inquiry',
      message: `${name} (${email}) sent an inquiry for project ID ${projectId}.`,
      type: 'INQUIRY',
      referenceId: newInquiry._id,
      isRead: false,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, message: 'Inquiry received. We will contact you shortly.', data: newInquiry });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInquiries = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (isConnectedToMongo) {
      const inquiries = await ProjectInquiryModel.find({
        $or: [{ userId: req.user.id }, { email: req.user.email }],
      }).sort({ createdAt: -1 });
      return res.json({ success: true, count: inquiries.length, data: inquiries });
    }

    const inquiries = store.projectInquiries.filter(
      (i) => i.userId === req.user?.id || i.email.toLowerCase() === req.user?.email.toLowerCase()
    );
    return res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
