import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { ConversationModel } from '../models/Conversation.js';
import { MessageModel } from '../models/Message.js';
import { UserModel } from '../models/User.js';
import { NotificationModel } from '../models/Notification.js';
import { isConnectedToMongo } from '../config/db.js';
import { notifyNewMessage, notifyNewNotification } from '../services/websocketService.js';

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

// Format clock time string (e.g., 10:15 AM)
const formatClockTime = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });

    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'TEAM_MEMBER';
    const userId = req.user.id;
    const userName = req.user.name || 'Client User';
    const userEmail = req.user.email || 'client@reliableinfotech.io';

    if (isAdmin) {
      // 1. Fetch all real registered users with role 'USER'
      let realUsers: any[] = [];
      if (isConnectedToMongo) {
        try {
          realUsers = await UserModel.find({
            role: 'USER',
            email: { $not: /@devcraft\.io/i },
          })
            .sort({ createdAt: -1 })
            .lean();
        } catch (err) {
          console.warn('[MongoDB realUsers lookup failed]:', err);
        }
      }

      if (realUsers.length === 0) {
        realUsers = store.users.filter(
          (u) => u.role === 'USER' && !u.email.toLowerCase().includes('@devcraft.io')
        );
      }

      // 2. Ensure every valid registered client has a conversation document
      for (const u of realUsers) {
        const uId = u._id ? u._id.toString() : u.id;
        const convId = `conv_${uId}`;

        let existing: any = null;
        if (isConnectedToMongo) {
          try {
            existing = await ConversationModel.findOne({
              $or: [{ _id: convId }, { participants: uId }],
            }).lean();
          } catch (e) {}
        }

        if (!existing) {
          existing = store.conversations.find(
            (c) => c._id === convId || (c.participants && c.participants.includes(uId))
          );
        }

        if (!existing) {
          const avatarUrl =
            u.avatar && u.avatar.startsWith('http')
              ? u.avatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.name || 'User'
                )}&background=2563eb&color=fff&bold=true`;

          const initialDoc = {
            _id: convId,
            participants: [uId, userId],
            clientName: u.name,
            clientEmail: u.email,
            clientAvatar: avatarUrl,
            projectSubject: 'Reliable Info Tech Support & Architecture Consultation',
            lastMessage: `Hello ${u.name}! Welcome to Reliable Info Tech. How can we help you today?`,
            unreadCount: 0,
            online: true,
            createdAt: u.createdAt || new Date(),
            updatedAt: new Date(),
          };

          if (isConnectedToMongo) {
            try {
              await ConversationModel.create(initialDoc);
            } catch (e) {}
          }
          store.conversations.push(initialDoc);
        }
      }

      // 3. Fetch all active conversations excluding dummy seed IDs & dummy domains
      let convs: any[] = [];
      if (isConnectedToMongo) {
        try {
          convs = await ConversationModel.find({
            clientEmail: { $not: /@devcraft\.io/i },
            _id: { $nin: ['conv_1', 'conv_2', 'conv_3'] },
          })
            .sort({ updatedAt: -1 })
            .lean();
        } catch (e) {
          console.warn('[MongoDB getConversations failed]:', e);
        }
      }

      if (convs.length === 0) {
        convs = store.conversations.filter(
          (c) =>
            !c.clientEmail?.toLowerCase().includes('@devcraft.io') &&
            !['conv_1', 'conv_2', 'conv_3'].includes(c._id || c.id)
        );
      }

      // 4. Enrich conversations with accurate messages & unread counts
      const enriched = await Promise.all(
        convs.map(async (c: any) => {
          const cId = c._id || c.id;
          let lastMsg: any = null;
          let unread = 0;

          if (isConnectedToMongo) {
            try {
              const msgs = await MessageModel.find({ conversationId: cId })
                .sort({ createdAt: -1 })
                .limit(1)
                .lean();
              if (msgs.length > 0) {
                lastMsg = msgs[0];
              }
              unread = await MessageModel.countDocuments({
                conversationId: cId,
                senderRole: 'USER',
                isRead: false,
              });
            } catch (e) {}
          } else {
            const memMsgs = store.messages.filter((m) => m.conversationId === cId);
            if (memMsgs.length > 0) {
              lastMsg = memMsgs[memMsgs.length - 1];
            }
            unread = memMsgs.filter((m) => m.senderRole === 'USER' && !m.isRead).length;
          }

          const lastMsgText = lastMsg ? lastMsg.message : c.lastMessage || 'No messages yet.';
          const lastMsgTime = lastMsg ? lastMsg.createdAt : c.updatedAt || c.createdAt || Date.now();

          const clientAvatar =
            c.clientAvatar && c.clientAvatar.startsWith('http')
              ? c.clientAvatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  c.clientName || 'User'
                )}&background=2563eb&color=fff&bold=true`;

          return {
            id: cId,
            _id: cId,
            clientName: c.clientName || 'Client',
            clientEmail: c.clientEmail || '',
            clientAvatar,
            projectSubject:
              c.projectSubject && !c.projectSubject.includes('DevCraft')
                ? c.projectSubject
                : 'Reliable Info Tech Support & Architecture Consultation',
            lastMessage: lastMsgText,
            time: formatRelativeTime(lastMsgTime),
            unreadCount: unread,
            online: c.online !== undefined ? c.online : true,
            updatedAt: lastMsgTime,
          };
        })
      );

      // Sort by latest message/update
      enriched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      return res.json({ success: true, data: enriched });
    } else {
      // CLIENT VIEW: Fetch only this client's conversation
      const userConvId = `conv_${userId}`;
      let clientConv: any = null;

      if (isConnectedToMongo) {
        try {
          clientConv = await ConversationModel.findOne({
            $or: [{ _id: userConvId }, { participants: userId }],
          }).lean();
        } catch (e) {}
      }

      if (!clientConv) {
        clientConv = store.conversations.find(
          (c) => c._id === userConvId || (c.participants && c.participants.includes(userId))
        );
      }

      if (!clientConv) {
        const avatarUrl =
          req.user.avatar && req.user.avatar.startsWith('http')
            ? req.user.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=2563eb&color=fff&bold=true`;

        const welcomeText = `Hello ${userName}! Welcome to Reliable Info Tech. Our team is here to assist you with custom website builds, milestones, and technical inquiries. How can we help you today?`;

        clientConv = {
          _id: userConvId,
          clientName: userName,
          clientEmail: userEmail,
          clientAvatar: avatarUrl,
          projectSubject: 'Reliable Info Tech Support & Architecture Consultation',
          participants: [userId, 'usr_admin_1'],
          lastMessage: welcomeText,
          unreadCount: 1,
          online: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const welcomeMsg = {
          _id: `msg_welcome_${userId}`,
          conversationId: userConvId,
          senderId: 'usr_admin_1',
          senderName: 'Priyajit Das (Administrator)',
          senderRole: 'ADMIN',
          message: welcomeText,
          attachments: [],
          isRead: false,
          createdAt: new Date(),
        };

        if (isConnectedToMongo) {
          try {
            await ConversationModel.create(clientConv);
            await MessageModel.create(welcomeMsg);
          } catch (e) {}
        }

        store.conversations.push(clientConv);
        store.messages.push(welcomeMsg);
      }

      const cId = clientConv._id || clientConv.id;
      let lastMsg: any = null;
      let unread = 0;

      if (isConnectedToMongo) {
        try {
          const msgs = await MessageModel.find({ conversationId: cId })
            .sort({ createdAt: -1 })
            .limit(1)
            .lean();
          if (msgs.length > 0) lastMsg = msgs[0];
          unread = await MessageModel.countDocuments({
            conversationId: cId,
            senderRole: { $ne: 'USER' },
            isRead: false,
          });
        } catch (e) {}
      } else {
        const memMsgs = store.messages.filter((m) => m.conversationId === cId);
        if (memMsgs.length > 0) lastMsg = memMsgs[memMsgs.length - 1];
        unread = memMsgs.filter((m) => m.senderRole !== 'USER' && !m.isRead).length;
      }

      const returnObj = {
        id: cId,
        _id: cId,
        clientName: clientConv.clientName || userName,
        clientEmail: clientConv.clientEmail || userEmail,
        clientAvatar:
          clientConv.clientAvatar && clientConv.clientAvatar.startsWith('http')
            ? clientConv.clientAvatar
            : DEFAULT_AVATAR,
        projectSubject:
          clientConv.projectSubject || 'Reliable Info Tech Support & Architecture Consultation',
        lastMessage: lastMsg ? lastMsg.message : clientConv.lastMessage,
        time: formatRelativeTime(lastMsg ? lastMsg.createdAt : clientConv.updatedAt),
        unreadCount: unread,
        online: true,
      };

      return res.json({ success: true, data: [returnObj] });
    }
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

    let targetConvId = id;

    if (!isAdmin) {
      let myConv: any = null;
      if (isConnectedToMongo) {
        try {
          myConv = await ConversationModel.findOne({
            $or: [{ _id: id, participants: currentUserId }, { participants: currentUserId }],
          }).lean();
        } catch (e) {}
      }
      if (!myConv) {
        myConv = store.conversations.find((c) => c.participants?.includes(currentUserId));
      }
      targetConvId = myConv ? myConv._id || myConv.id : `conv_${currentUserId}`;
    }

    // Auto mark as read on retrieval
    if (isConnectedToMongo) {
      try {
        if (isAdmin) {
          await MessageModel.updateMany(
            { conversationId: targetConvId, senderRole: 'USER', isRead: false },
            { $set: { isRead: true } }
          );
          await ConversationModel.findByIdAndUpdate(targetConvId, { unreadCount: 0 });
        } else {
          await MessageModel.updateMany(
            { conversationId: targetConvId, senderRole: { $ne: 'USER' }, isRead: false },
            { $set: { isRead: true } }
          );
        }
      } catch (e) {}
    }

    let messages: any[] = [];
    if (isConnectedToMongo) {
      try {
        messages = await MessageModel.find({ conversationId: targetConvId })
          .sort({ createdAt: 1 })
          .lean();
      } catch (e) {
        console.warn('[MongoDB getMessages failed, falling back to memory store]:', e);
      }
    }

    if (messages.length === 0) {
      messages = store.messages.filter((m) => m.conversationId === targetConvId);
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Privacy guard: A client user never sees messages from another client
    if (!isAdmin) {
      messages = messages.filter(
        (m) =>
          m.senderId === currentUserId ||
          m.senderRole === 'ADMIN' ||
          m.senderRole === 'TEAM_MEMBER'
      );
    }

    const formatMsg = (m: any) => {
      const isMe = isAdmin
        ? m.senderRole === 'ADMIN' || m.senderRole === 'TEAM_MEMBER' || m.senderId === currentUserId
        : m.senderId === currentUserId;

      let senderName = m.senderName;
      if (m.senderRole === 'ADMIN' || m.senderRole === 'TEAM_MEMBER') {
        senderName = m.senderName || 'Priyajit Das (Administrator)';
      }

      return {
        id: m._id || m.id,
        _id: m._id || m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName,
        senderRole: m.senderRole || 'USER',
        text: m.message,
        message: m.message,
        time: formatClockTime(m.createdAt || Date.now()),
        isMe: Boolean(isMe),
        isRead: m.isRead,
        createdAt: m.createdAt,
      };
    };

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
    const currentUserRole = req.user?.role || 'USER';
    const isAdmin = currentUserRole === 'ADMIN' || currentUserRole === 'TEAM_MEMBER';
    const currentUserName =
      req.user?.name || (isAdmin ? 'Priyajit Das (Administrator)' : 'Client');

    let targetConvId = id;
    if (!isAdmin) {
      let myConv: any = null;
      if (isConnectedToMongo) {
        try {
          myConv = await ConversationModel.findOne({
            $or: [{ _id: id, participants: currentUserId }, { participants: currentUserId }],
          }).lean();
        } catch (e) {}
      }
      if (!myConv) {
        myConv = store.conversations.find((c) => c.participants?.includes(currentUserId));
      }
      targetConvId = myConv ? myConv._id || myConv.id : `conv_${currentUserId}`;
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
        await MessageModel.create(newMessageData);
        await ConversationModel.findByIdAndUpdate(targetConvId, {
          lastMessage: content,
          updatedAt: new Date(),
          ...(isAdmin ? {} : { $inc: { unreadCount: 1 } }),
        });

        // Notify Admin if message from client
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
        console.warn('[MongoDB sendMessage error]:', e);
      }
    }

    // In-memory store sync
    store.messages.push(newMessageData);

    // Real-time WebSocket event dispatch
    notifyNewMessage(newMessageData);
    if (!isAdmin) {
      notifyNewNotification({
        userId: 'usr_admin_1',
        title: `New Message from ${currentUserName}`,
        message: content.length > 80 ? `${content.substring(0, 80)}...` : content,
        type: 'MESSAGE',
        referenceId: targetConvId,
        createdAt: new Date().toISOString(),
      });
    }

    const conv = store.conversations.find((c) => c._id === targetConvId || c.id === targetConvId);
    if (conv) {
      conv.lastMessage = content;
      conv.updatedAt = new Date();
      if (!isAdmin) {
        conv.unreadCount = (conv.unreadCount || 0) + 1;
      }
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
      await MessageModel.updateMany({ conversationId: id, senderRole: 'USER' }, { $set: { isRead: true } });
      await ConversationModel.findByIdAndUpdate(id, { unreadCount: 0 });
    }

    store.messages.forEach((m) => {
      if (m.conversationId === id && m.senderRole === 'USER') {
        m.isRead = true;
      }
    });

    const conv = store.conversations.find((c) => c._id === id || c.id === id);
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
    const initialMessage = (message || 'Hello Reliable Info Tech Team!').trim();

    const newConv = {
      _id: newConvId,
      clientName: clientName || currentUserName,
      clientEmail: clientEmail || req.user?.email || 'client@reliableinfotech.io',
      clientAvatar: DEFAULT_AVATAR,
      projectSubject: projectSubject || 'Reliable Info Tech Support & Architecture Consultation',
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

    return res.status(201).json({ success: true, data: newConv });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
