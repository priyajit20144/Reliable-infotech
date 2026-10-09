import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document<string> {
  requestId?: mongoose.Types.ObjectId | string;
  participants: string[];
  clientName?: string;
  clientEmail?: string;
  clientAvatar?: string;
  projectSubject?: string;
  lastMessage?: string;
  unreadCount?: number;
  online?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    _id: { type: String, default: () => `conv_${Date.now()}` },
    requestId: { type: Schema.Types.Mixed, index: true },
    participants: [{ type: String, required: true, index: true }],
    clientName: { type: String },
    clientEmail: { type: String },
    clientAvatar: { type: String },
    projectSubject: { type: String },
    lastMessage: { type: String, default: '' },
    unreadCount: { type: Number, default: 0 },
    online: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ConversationModel =
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
