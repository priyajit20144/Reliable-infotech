import { Request, Response } from 'express';
import { store } from '../seed/seedData.js';
import { ContactMessageModel } from '../models/ContactMessage.js';
import { NotificationModel } from '../models/Notification.js';
import { isConnectedToMongo } from '../config/db.js';
import { sendContactNotification } from '../services/emailService.js';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const newContact = {
      _id: `cnt_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Contact',
      message,
      status: 'UNREAD',
      createdAt: new Date(),
    };

    // Dispatch transactional email via Brevo relay asynchronously
    sendContactNotification({ name, email, phone, subject, message }).catch((err) => {
      console.warn('[Brevo Contact Email Dispatch Error]:', err?.message);
    });

    if (isConnectedToMongo) {
      const created = await ContactMessageModel.create(newContact);
      await NotificationModel.create({
        userId: 'usr_admin_1',
        title: 'New Contact Form Submission',
        message: `From ${name} (${email}): ${subject || 'General Inquiry'}`,
        type: 'INQUIRY',
        referenceId: created._id.toString(),
      });
      return res.status(201).json({ success: true, message: 'Message sent! Our team will get back to you within 24 hours.' });
    }


    // Sync into conversations so it immediately shows up in Admin Panel Messages section
    const convId = `conv_contact_${Date.now()}`;
    const newConv = {
      _id: convId,
      clientName: name,
      clientEmail: email,
      clientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      projectSubject: subject || 'Inbound Web Inquiry',
      participants: ['usr_admin_1'],
      lastMessage: message,
      time: 'Just now',
      unreadCount: 1,
      online: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const firstMsg = {
      _id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: 'usr_guest',
      senderName: name,
      senderRole: 'USER',
      message: message,
      attachments: [],
      isRead: false,
      createdAt: new Date(),
    };
    store.conversations.unshift(newConv);
    store.messages.push(firstMsg);

    return res.status(201).json({ success: true, message: 'Message sent! Our team will get back to you within 24 hours.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
