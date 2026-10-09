import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { CustomRequestModel } from '../models/CustomRequest.js';
import { NotificationModel } from '../models/Notification.js';
import { UserModel } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';

export const createCustomRequest = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      businessName,
      websiteType,
      description,
      requiredFeatures,
      budgetMin,
      budgetMax,
      deadline,
      referenceUrls,
      attachments,
      contactMethod,
    } = req.body;

    if (!name || !email || !websiteType || !description) {
      return res.status(400).json({ success: false, message: 'Please fill out all required fields.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userId = req.user?.id;

    if (!userId && isConnectedToMongo) {
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        userId = existingUser._id.toString();
      }
    }
    if (!userId) {
      const matchInStore = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (matchInStore) {
        userId = matchInStore._id;
      }
    }
    if (!userId) {
      userId = `usr_guest_${Date.now()}`;
    }

    const newRequestData = {
      _id: `req_${Date.now()}`,
      userId,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      businessName: businessName?.trim() || '',
      websiteType,
      description: description.trim(),
      requiredFeatures: Array.isArray(requiredFeatures) ? requiredFeatures : [],
      budgetMin: Number(budgetMin) || 500,
      budgetMax: Number(budgetMax) || 2500,
      deadline: deadline || '',
      referenceUrls: Array.isArray(referenceUrls) ? referenceUrls : [],
      attachments: Array.isArray(attachments) ? attachments : [],
      contactMethod: contactMethod || 'EMAIL',
      status: 'NEW',
      priority: 'MEDIUM',
      assignedTo: 'DevCraft Core Team',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedRequest: any;
    if (isConnectedToMongo) {
      savedRequest = await CustomRequestModel.create(newRequestData);
      
      // Notify all admin accounts
      try {
        const admins = await UserModel.find({ role: { $in: ['ADMIN', 'TEAM_MEMBER'] } });
        for (const admin of admins) {
          await NotificationModel.create({
            userId: admin._id.toString(),
            title: 'New Custom Request Submitted',
            message: `${name} requested a new ${websiteType} project (${businessName || 'Direct'}).`,
            type: 'REQUEST_STATUS',
            referenceId: savedRequest._id.toString(),
          });
        }
      } catch (notifErr) {
        console.warn('Failed to dispatch notifications to admins:', notifErr);
      }
    } else {
      savedRequest = newRequestData;
      store.customRequests.unshift(savedRequest);
      store.notifications.unshift({
        _id: `notif_${Date.now()}`,
        userId: 'usr_admin_1',
        title: 'New Custom Request Submitted',
        message: `${name} requested a new ${websiteType} project (${businessName || 'Direct'}).`,
        type: 'REQUEST_STATUS',
        referenceId: savedRequest._id,
        isRead: false,
        createdAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Your custom website request has been successfully created. Our team will review it promptly.',
      data: savedRequest,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (isConnectedToMongo) {
      try {
        const requests = await CustomRequestModel.find({
          $or: [{ userId: req.user.id }, { email: req.user.email }],
        }).sort({ createdAt: -1 });
        return res.json({ success: true, count: requests.length, data: requests });
      } catch (e) {
        console.warn('[MongoDB find requests failed, falling back to store]:', e);
      }
    }

    const requests = store.customRequests.filter(
      (r) => r.userId === req.user?.id || r.email.toLowerCase() === req.user?.email.toLowerCase()
    );
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const request = await CustomRequestModel.findById(id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

      // Check authorization: owner, team, or admin
      const isOwner =
        request.userId.toString() === req.user?.id ||
        (request.email && req.user?.email && request.email.toLowerCase() === req.user.email.toLowerCase());
      
      if (
        req.user?.role !== 'ADMIN' &&
        req.user?.role !== 'TEAM_MEMBER' &&
        !isOwner
      ) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view this request.' });
      }

      return res.json({ success: true, data: request });
    }

    const request = store.customRequests.find((r) => r._id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isOwnerMemory =
      request.userId === req.user?.id ||
      (request.email && req.user?.email && request.email.toLowerCase() === req.user.email.toLowerCase());

    if (
      req.user?.role !== 'ADMIN' &&
      req.user?.role !== 'TEAM_MEMBER' &&
      !isOwnerMemory
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this request.' });
    }

    return res.json({ success: true, data: request });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
