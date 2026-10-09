import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document<string> {
  conversationId: mongoose.Types.ObjectId | string;
  senderId: mongoose.Types.ObjectId | string;
  senderName: string;
  senderRole: string;
  message: string;
  attachments: string[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    _id: { type: String, default: () => `msg_${Date.now()}` },
    conversationId: { type: Schema.Types.Mixed, required: true, index: true },
    senderId: { type: Schema.Types.Mixed, required: true, index: true },
    senderName: { type: String, default: 'User' },
    senderRole: { type: String, default: 'USER' },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
