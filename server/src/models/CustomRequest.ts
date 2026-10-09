import mongoose, { Schema, Document } from 'mongoose';

export type CustomRequestStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'REQUIREMENTS'
  | 'QUOTATION'
  | 'APPROVED'
  | 'IN_DEVELOPMENT'
  | 'TESTING'
  | 'COMPLETED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ICustomRequest extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  websiteType: string;
  description: string;
  requiredFeatures: string[];
  budgetMin: number;
  budgetMax: number;
  deadline?: string;
  referenceUrls: string[];
  attachments: string[];
  contactMethod: 'EMAIL' | 'PHONE' | 'WHATSAPP';
  status: CustomRequestStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    _id: { type: String, default: () => `req_${Date.now()}` },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    businessName: { type: String, default: '' },
    websiteType: { type: String, required: true },
    description: { type: String, required: true },
    requiredFeatures: [{ type: String }],
    budgetMin: { type: Number, default: 500 },
    budgetMax: { type: Number, default: 2500 },
    deadline: { type: String, default: '' },
    referenceUrls: [{ type: String }],
    attachments: [{ type: String }],
    contactMethod: { type: String, enum: ['EMAIL', 'PHONE', 'WHATSAPP'], default: 'EMAIL' },
    status: {
      type: String,
      enum: [
        'NEW',
        'UNDER_REVIEW',
        'REQUIREMENTS',
        'QUOTATION',
        'APPROVED',
        'IN_DEVELOPMENT',
        'TESTING',
        'COMPLETED',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'NEW',
      index: true,
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    assignedTo: { type: String, default: 'DevCraft Core Team' },
  },
  { timestamps: true }
);

export const CustomRequestModel =
  mongoose.models.CustomRequest || mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);
