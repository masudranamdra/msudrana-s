import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  dribbble?: string;
  medium?: string;
}

export interface IConfig extends Document {
  heroTitle: string;
  heroSubtitle: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: ISocialLinks;
  siteDescription: string;
  seoKeywords: string[];
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  siteLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConfigSchema = new Schema<IConfig>(
  {
    heroTitle: {
      type: String,
      required: [true, 'Hero Title is required'],
      default: 'I am a Professional Software Engineer',
    },
    heroSubtitle: {
      type: String,
      required: [true, 'Hero Subtitle is required'],
      default: 'Building premium digital products, apps, and SaaS applications with Next.js and Node.js.',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      medium: { type: String, default: '' },
    },
    siteDescription: {
      type: String,
      default: 'Welcome to my professional portfolio management system.',
    },
    seoKeywords: {
      type: [String],
      default: ['portfolio', 'saas', 'nextjs', 'developer'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact Email is required'],
      default: 'admin@example.com',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    contactAddress: {
      type: String,
      default: '',
    },
    siteLogo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);
