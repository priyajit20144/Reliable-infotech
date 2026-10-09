import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    _id: 'notif_1',
    userId: 'usr_client_1',
    title: 'Status Update: In Progress',
    message: 'Your custom request "Horizon Creative Studio" has advanced to IN_DEVELOPMENT.',
    type: 'REQUEST_STATUS',
    referenceId: 'req_101',
    isRead: false,
    createdAt: '2026-03-05T14:35:00.000Z',
  },
  {
    _id: 'notif_2',
    userId: 'usr_client_1',
    title: 'New Team Message',
    message: 'Sarah Chen sent an update regarding your project wireframes.',
    type: 'MESSAGE',
    referenceId: 'req_101',
    isRead: false,
    createdAt: '2026-03-05T14:31:00.000Z',
  },
  {
    _id: 'notif_3',
    userId: 'usr_client_1',
    title: 'Project Delivered',
    message: 'Your project "Rahul Sharma Portfolio" was successfully delivered and launched.',
    type: 'PROJECT_COMPLETED',
    referenceId: 'req_103',
    isRead: true,
    createdAt: '2026-03-01T16:00:00.000Z',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications(DEFAULT_NOTIFICATIONS);
      setUnreadCount(2);
      return;
    }
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        setUnreadCount(2);
      }
    } catch (err) {
      setNotifications(DEFAULT_NOTIFICATIONS);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
