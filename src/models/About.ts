import mongoose, { Schema, Document } from 'mongoose';

export interface IStat {
  label: string;
  value: string;
  icon: string;
  description?: string;
  colorClass?: string;
}

export interface ILifestyleImage {
  url: string;
  publicId?: string;
}

export interface ISocialLink {
  platform: string; // linkedin, github, twitter, portfolio, email, etc.
  url: string;
  icon?: string;
  label?: string;
}

export interface IAbout extends Document {
  name: string;
  title: string;
  subtitle: string;
  missionStatement: string;
  fullDescription: string;
  imageUrl: string;
  resumeUrl: string;
  stats: IStat[];
  highlights: string[];
  
  // New Professional Fields
  professionalSummary?: string;
  whoIAm?: string;
  philosophy?: string;
  coreValues?: string[];
  currentFocus?: string[];
  email?: string;
  location?: string;

  // Social Links & Contact
  socialLinks?: ISocialLink[];

  // Lifestyle & Daily Life Additions
  lifestyleText: string;
  dailyLifeActivities: string[];
  lifestyleImages: ILifestyleImage[];

  backgroundColor: string;
  textColor: string;
  accentColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatSchema = new Schema<IStat>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String },
  colorClass: { type: String }
});

const LifestyleImageSchema = new Schema<ILifestyleImage>({
  url: { type: String, required: true },
  publicId: { type: String }
});

const SocialLinkSchema = new Schema<ISocialLink>({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  label: { type: String }
});

const AboutSchema = new Schema<IAbout>(
  {
    name: {
      type: String,
      default: 'John Doe',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      default: 'My Journey & Mission',
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      default: 'Mission',
    },
    missionStatement: {
      type: String,
      default: 'I specialize in developing high-performance web applications using modern stacks.',
    },
    fullDescription: {
      type: String,
      default: 'From crafting complex database queries on robust servers to building client-rich interactive React interfaces, I strive to write clean, reusable, and secure code. I prioritize building modular components that are easy to maintain and scale.',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    professionalSummary: {
      type: String,
      default: '',
    },
    whoIAm: {
      type: String,
      default: '',
    },
    philosophy: {
      type: String,
      default: '',
    },
    coreValues: {
      type: [String],
      default: [],
    },
    currentFocus: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
    },
    stats: {
      type: [StatSchema],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    lifestyleText: {
      type: String,
      default: 'When I am not coding, I enjoy exploring the great outdoors and finding new coffee shops.'
    },
    dailyLifeActivities: {
      type: [String],
      default: []
    },
    lifestyleImages: {
      type: [LifestyleImageSchema],
      default: []
    },
    backgroundColor: {
      type: String,
      default: 'bg-[#F5F7FB] dark:bg-[#0F172A]',
    },
    textColor: {
      type: String,
      default: 'text-[#0F172A] dark:text-white',
    },
    accentColor: {
      type: String,
      default: 'text-[#2563EB] dark:text-blue-400',
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);
