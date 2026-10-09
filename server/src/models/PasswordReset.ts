import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  otpHash: string;
  resetToken: string;
  verificationToken?: string;
  attempts: number;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: automatically purges expired records
    },
  },
  { timestamps: true }
);

export const PasswordResetModel =
  mongoose.models.PasswordReset || mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);
