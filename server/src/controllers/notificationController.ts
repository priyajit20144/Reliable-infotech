import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { NotificationModel } from '../models/Notification.js';
import { isConnectedToMongo } from '../config/db.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    if (isConnectedToMongo) {
      try {
        const notifications = await NotificationModel.find({
          $or: [{ userId: req.user.id }, { userId: 'all' }],
        }).sort({ createdAt: -1 });
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        return res.json({ success: true, count: notifications.length, unreadCount, data: notifications });
      } catch (e) {
        console.warn('[MongoDB find notifications failed, falling back to store]:', e);
      }
    }

    const notifications = store.notifications.filter(
      (n) => n.userId === req.user?.id || n.userId === 'all'
    );
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.json({ success: true, count: notifications.length, unreadCount, data: notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      await NotificationModel.findByIdAndUpdate(id, { isRead: true });
      return res.json({ success: true, message: 'Notification marked as read.' });
    }

    const notif = store.notifications.find((n) => n._id === id);
    if (notif) notif.isRead = true;
    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    if (isConnectedToMongo) {
      await NotificationModel.updateMany({ userId: req.user.id }, { isRead: true });
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    store.notifications
      .filter((n) => n.userId === req.user?.id)
      .forEach((n) => (n.isRead = true));

    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
