import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { ConversationModel } from '../models/Conversation.js';
import { MessageModel } from '../models/Message.js';
import { NotificationModel } from '../models/Notification.js';
import { isConnectedToMongo } from '../config/db.js';

// Format relative time helper
const formatRelativeTime = (date: Date | string | number): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Format time string (e.g., 10:15 AM)
const formatClockTime = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'TEAM_MEMBER';
    const userId = req.user.id;
    const userName = req.user.name || 'Client User';
    const userEmail = req.user.email || 'client@devcraft.io';

    // Enrich conversation object with full details
    const enrich = (c: any) => {
      let client = store.users.find(
        (u) => c.participants && c.participants.includes(u._id) && u.role === 'USER'
      );
      if (!client && c.participants) {
        client = store.users.find((u) => c.participants.includes(u._id));
      }

      const convMessages = store.messages.filter((m) => m.conversationId === (c._id || c.id));
      const lastMsgObj = convMessages[convMessages.length - 1];

      // Unread messages count for this viewer
      const unreadCount = convMessages.filter(
        (m) => !m.isRead && (isAdmin ? m.senderRole === 'USER' : m.senderRole !== 'USER')
      ).length;

      return {
        id: c._id || c.id,
        _id: c._id || c.id,
        clientName: c.clientName || client?.name || userName,
        clientEmail: c.clientEmail || client?.email || userEmail,
        clientAvatar:
          c.clientAvatar ||
          client?.avatar ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        projectSubject: c.projectSubject || 'DevCraft Support & Architecture Consultation',
        lastMessage: lastMsgObj ? lastMsgObj.message : c.lastMessage || 'No messages yet.',
        time: formatRelativeTime(c.updatedAt || c.createdAt || Date.now()),
        unreadCount: c.unreadCount !== undefined ? c.unreadCount : unreadCount,
        online: c.online !== undefined ? c.online : true,
        participants: c.participants || [],
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    };

    let convs: any[] = [];

    if (isConnectedToMongo) {
      try {
        let query: any = {};
        if (!isAdmin) {
          query = { participants: userId };
        }
        const mongoConvs = await ConversationModel.find(query).sort({ updatedAt: -1 });
        convs = mongoConvs.map((c) => (c.toObject ? c.toObject() : c));
      } catch (err) {
        console.warn('[MongoDB getConversations failed, falling back to memory store]:', err);
      }
    }

    if (convs.length === 0) {
      if (isAdmin) {
        convs = [...store.conversations];
      } else {
        convs = store.conversations.filter(
          (c) => c.participants && c.participants.includes(userId)
        );
      }
    }

    // AUTO-PROVISION CLIENT THREAD: If a client has no active conversation with Admin, create one!
    if (!isAdmin && convs.length === 0) {
      const userConvId = `conv_${userId}`;
      const defaultConv = {
        _id: userConvId,
        id: userConvId,
        clientName: userName,
        clientEmail: userEmail,
        clientAvatar:
          req.user.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        projectSubject: 'DevCraft Support & Architecture Consultation',
        participants: [userId, 'usr_admin_1'],
        lastMessage: `Hello ${userName}! Welcome to DevCraft. Our lead architects and project managers are here to assist you with custom website builds, milestones, and technical inquiries. How can we help you today?`,
        unreadCount: 1,
        online: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const welcomeMsg = {
        _id: `msg_welcome_${userId}`,
        id: `msg_welcome_${userId}`,
        conversationId: userConvId,
        senderId: 'usr_admin_1',
        senderName: 'Alex Rivera',
        senderRole: 'ADMIN',
        message: `Hello ${userName}! Welcome to DevCraft. Our lead architects and project managers are here to assist you with custom website builds, milestones, and technical inquiries. How can we help you today?`,
        attachments: [],
        isRead: false,
        createdAt: new Date(),
      };

      if (isConnectedToMongo) {
        try {
          await ConversationModel.create(defaultConv);
          await MessageModel.create(welcomeMsg);
        } catch (e) {
          console.warn('[MongoDB auto-create conversation failed]:', e);
        }
      }

      store.conversations.push(defaultConv);
      store.messages.push(welcomeMsg);
      convs.push(defaultConv);
    }

    // Sort by updatedAt descending
    convs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const enriched = convs.map(enrich);
    return res.json({ success: true, data: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // conversationId
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'TEAM_MEMBER';

    // PRIVACY ENFORCEMENT:
    // If not admin, verify that current user is a participant.
    // If user is not part of this conversation, find or redirect to their own conversation!
    let targetConvId = id;

    let conv: any = null;
    if (isConnectedToMongo) {
      try {
        conv = await ConversationModel.findById(id);
      } catch (e) {}
    }
    if (!conv) {
      conv = store.conversations.find((c) => c._id === id || c.id === id);
    }

    if (!isAdmin) {
      if (!conv || !conv.participants || !conv.participants.includes(currentUserId)) {
        // Fall back to current user's dedicated thread
        let myConv: any = null;
        if (isConnectedToMongo) {
          try {
            myConv = await ConversationModel.findOne({ participants: currentUserId });
          } catch (e) {}
        }
        if (!myConv) {
          myConv = store.conversations.find((c) => c.participants && c.participants.includes(currentUserId));
        }
        targetConvId = myConv ? (myConv._id || myConv.id) : `conv_${currentUserId}`;
      }
    }

    const formatMsg = (m: any) => {
      const isMe = m.senderId === currentUserId;
      return {
        id: m._id || m.id,
        _id: m._id || m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName || (m.senderRole === 'ADMIN' ? 'Alex Rivera' : 'Client'),
        senderRole: m.senderRole || 'USER',
        text: m.message,
        message: m.message,
        time: formatClockTime(m.createdAt || Date.now()),
        isMe: Boolean(isMe),
        isRead: m.isRead,
        createdAt: m.createdAt,
      };
    };

    let messages: any[] = [];
    if (isConnectedToMongo) {
      try {
        const mongoMessages = await MessageModel.find({ conversationId: targetConvId }).sort({ createdAt: 1 });
        messages = mongoMessages.map((m) => (m.toObject ? m.toObject() : m));
      } catch (e) {
        console.warn('[MongoDB getMessages failed, falling back to memory store]:', e);
      }
    }

    if (messages.length === 0) {
      messages = store.messages.filter((m) => m.conversationId === targetConvId);
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // STRICT USER-ADMIN PRIVACY:
    // A client user must NEVER see other clients' messages.
    // Show strictly messages from the logged-in client or DevCraft Admin / Team Members!
    if (!isAdmin) {
      messages = messages.filter(
        (m) =>
          m.senderId === currentUserId ||
          m.senderRole === 'ADMIN' ||
          m.senderRole === 'TEAM_MEMBER'
      );
    }

    // If still 0 messages for this client's conversation, provide the initial admin welcome message
    if (messages.length === 0 && !isAdmin) {
      const welcomeMsg = {
        _id: `msg_welcome_${currentUserId}`,
        id: `msg_welcome_${currentUserId}`,
        conversationId: targetConvId,
        senderId: 'usr_admin_1',
        senderName: 'Alex Rivera',
        senderRole: 'ADMIN',
        message: `Hello ${req.user?.name || 'there'}! Welcome to DevCraft. Our lead architects and project managers are here to assist you with custom website builds, milestones, and technical inquiries. How can we help you today?`,
        attachments: [],
        isRead: true,
        createdAt: new Date(),
      };
      if (isConnectedToMongo) {
        try {
          await MessageModel.create(welcomeMsg);
        } catch (e) {}
      }
      store.messages.push(welcomeMsg);
      messages = [welcomeMsg];
    }

    return res.json({ success: true, data: messages.map(formatMsg) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // conversationId
    const { message, text, attachments } = req.body;
    const content = (message || text || '').trim();

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    const currentUserId = req.user?.id || 'usr_client_1';
    const currentUserName = req.user?.name || (req.user?.role === 'ADMIN' ? 'Alex Rivera' : 'Rahul Sharma');
    const currentUserRole = req.user?.role || 'USER';
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'TEAM_MEMBER';

    // Ensure target conversation matches current user if not admin
    let targetConvId = id;
    if (!isAdmin) {
      let authorized = false;
      if (isConnectedToMongo) {
        try {
          const mConv = await ConversationModel.findById(id);
          if (mConv && mConv.participants && mConv.participants.includes(currentUserId)) {
            authorized = true;
          }
        } catch (e) {}
      }
      if (!authorized) {
        const memConv = store.conversations.find(
          (c) => (c._id === id || c.id === id) && c.participants?.includes(currentUserId)
        );
        if (memConv) {
          authorized = true;
        }
      }

      if (!authorized) {
        let myConv: any = null;
        if (isConnectedToMongo) {
          try {
            myConv = await ConversationModel.findOne({ participants: currentUserId });
          } catch (e) {}
        }
        if (!myConv) {
          myConv = store.conversations.find((c) => c.participants && c.participants.includes(currentUserId));
        }
        targetConvId = myConv ? (myConv._id || myConv.id) : `conv_${currentUserId}`;
      }
    }

    const newMessageData = {
      _id: `msg_${Date.now()}`,
      id: `msg_${Date.now()}`,
      conversationId: targetConvId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      message: content,
      attachments: Array.isArray(attachments) ? attachments : [],
      isRead: false,
      createdAt: new Date(),
    };

    if (isConnectedToMongo) {
      try {
        const createdMsg = await MessageModel.create(newMessageData);
        await ConversationModel.findByIdAndUpdate(targetConvId, {
          lastMessage: content,
          updatedAt: new Date(),
        });

        // Notify the recipient
        if (!isAdmin) {
          await NotificationModel.create({
            userId: 'usr_admin_1',
            title: `New Message from ${currentUserName}`,
            message: content.length > 80 ? `${content.substring(0, 80)}...` : content,
            type: 'MESSAGE',
            referenceId: targetConvId,
            isRead: false,
          });
        }
      } catch (e) {
        console.warn('[MongoDB sendMessage error, saved to memory]:', e);
      }
    }

    // In-memory store
    store.messages.push(newMessageData);

    const conv = store.conversations.find((c) => c._id === targetConvId || c.id === targetConvId);
    if (conv) {
      conv.lastMessage = content;
      conv.updatedAt = new Date();
      if (!isAdmin) {
        conv.unreadCount = (conv.unreadCount || 0) + 1;
      }
    } else {
      store.conversations.push({
        _id: targetConvId,
        id: targetConvId,
        clientName: currentUserName,
        clientEmail: req.user?.email || '',
        clientAvatar: req.user?.avatar || '',
        projectSubject: 'DevCraft Support & Architecture Consultation',
        participants: [currentUserId, 'usr_admin_1'],
        lastMessage: content,
        unreadCount: 1,
        online: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Create Notification in store
    if (!isAdmin) {
      store.notifications.unshift({
        _id: `notif_${Date.now()}`,
        userId: 'usr_admin_1',
        title: `New Message from ${currentUserName}`,
        message: content.length > 80 ? `${content.substring(0, 80)}...` : content,
        type: 'MESSAGE',
        referenceId: targetConvId,
        isRead: false,
        createdAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        id: newMessageData._id,
        _id: newMessageData._id,
        conversationId: targetConvId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        text: content,
        message: content,
        time: formatClockTime(newMessageData.createdAt),
        isMe: true,
        isRead: false,
        createdAt: newMessageData.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markConversationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      await MessageModel.updateMany({ conversationId: id }, { isRead: true });
    }

    store.messages.forEach((m) => {
      if (m.conversationId === id) {
        m.isRead = true;
      }
    });

    const conv = store.conversations.find((c) => c._id === id);
    if (conv) {
      conv.unreadCount = 0;
    }

    return res.json({ success: true, message: 'Conversation marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { clientEmail, clientName, projectSubject, message } = req.body;
    const currentUserId = req.user?.id || 'usr_client_1';
    const currentUserName = req.user?.name || clientName || 'Client';

    const newConvId = `conv_${Date.now()}`;
    const initialMessage = (message || 'Hello DevCraft Team!').trim();

    const newConv = {
      _id: newConvId,
      clientName: clientName || currentUserName,
      clientEmail: clientEmail || req.user?.email || 'client@devcraft.io',
      clientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      projectSubject: projectSubject || 'New Project Inquiry',
      participants: [currentUserId, 'usr_admin_1'],
      lastMessage: initialMessage,
      time: 'Just now',
      unreadCount: 1,
      online: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const firstMsg = {
      _id: `msg_${Date.now()}`,
      conversationId: newConvId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: req.user?.role || 'USER',
      message: initialMessage,
      attachments: [],
      isRead: false,
      createdAt: new Date(),
    };

    if (isConnectedToMongo) {
      await ConversationModel.create(newConv);
      await MessageModel.create(firstMsg);
    }

    store.conversations.unshift(newConv);
    store.messages.push(firstMsg);

    // Notification for admin
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      title: `New Inquiry from ${newConv.clientName}`,
      message: initialMessage,
      type: 'MESSAGE',
      referenceId: newConvId,
      isRead: false,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, data: newConv });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
