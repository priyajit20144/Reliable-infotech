import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectInquiry extends Document<string> {
  userId?: mongoose.Types.ObjectId | string;
  projectId: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectInquirySchema = new Schema<IProjectInquiry>(
  {
    _id: { type: String, default: () => `inq_${Date.now()}` },
    userId: { type: Schema.Types.Mixed, index: true },
    projectId: { type: Schema.Types.Mixed, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['NEW', 'CONTACTED', 'QUOTED', 'CLOSED'], default: 'NEW', index: true },
  },
  { timestamps: true }
);

export const ProjectInquiryModel =
  mongoose.models.ProjectInquiry || mongoose.model<IProjectInquiry>('ProjectInquiry', ProjectInquirySchema);
