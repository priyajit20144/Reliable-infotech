import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  type: 'INQUIRY' | 'REQUEST_STATUS' | 'TEAM_ASSIGNED' | 'MESSAGE' | 'PROJECT_COMPLETED' | 'SYSTEM';
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    _id: { type: String, default: () => `notif_${Date.now()}` },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['INQUIRY', 'REQUEST_STATUS', 'TEAM_ASSIGNED', 'MESSAGE', 'PROJECT_COMPLETED', 'SYSTEM'],
      default: 'SYSTEM',
    },
    referenceId: { type: String, default: '' },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
