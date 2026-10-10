import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemMeta extends Document {
  key: string;
  hasSeededProjects: boolean;
  deletedProjectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SystemMetaSchema = new Schema<ISystemMeta>(
  {
    key: { type: String, required: true, unique: true, default: 'devcraft_system_state' },
    hasSeededProjects: { type: Boolean, default: false },
    deletedProjectIds: [{ type: String }],
  },
  { timestamps: true }
);

export const SystemMetaModel =
  mongoose.models.SystemMeta || mongoose.model<ISystemMeta>('SystemMeta', SystemMetaSchema);
