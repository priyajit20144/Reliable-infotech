import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document<string> {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    _id: { type: String, default: () => `cnt_${Date.now()}` },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['UNREAD', 'READ', 'REPLIED'], default: 'UNREAD', index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactMessageModel =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
