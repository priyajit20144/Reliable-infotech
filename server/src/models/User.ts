import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document<string> {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'TEAM_MEMBER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => `usr_${Date.now()}` },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['USER', 'TEAM_MEMBER', 'ADMIN'], default: 'USER', index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
