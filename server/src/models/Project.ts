import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document<string> {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  features: string[];
  images: string[];
  thumbnail: string;
  demoUrl?: string;
  githubUrl?: string;
  price?: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    _id: { type: String, default: () => `proj_${Date.now()}` },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    technologies: [{ type: String }],
    features: [{ type: String }],
    images: [{ type: String }],
    thumbnail: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED'], default: 'PUBLISHED', index: true },
    featured: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.Mixed, default: 'admin' },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
