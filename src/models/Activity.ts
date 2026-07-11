import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  date: string; // e.g. "Oct 2023 - Present"
  duration?: string; // e.g. "3 Months"
  category: 'Work' | 'Education' | 'Course' | 'Award' | 'Project' | 'Other';
  icon: string; // Lucide icon name
  image?: {
    url: string;
    publicId?: string;
  };
  fullDetails?: string;
  order: number;
  
  // Generic flags
  isFeatured: boolean;
  isPublished: boolean;
  isCurrent: boolean;

  // Work specific
  companyName?: string;
  employmentType?: string;
  location?: string;
  responsibilities?: string[];
  technologies?: string[];
  companyWebsite?: string;

  // Education specific
  degree?: string;
  department?: string;
  instituteName?: string;
  session?: string;
  cgpa?: string;
  academicAchievements?: string[];

  // Course specific
  platform?: string;
  instructor?: string;
  completionDate?: string;
  skillsLearned?: string[];
  credentialLink?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: [true, 'Activity title is required'], trim: true },
    description: { type: String, required: [true, 'Activity description is required'] },
    date: { type: String, required: [true, 'Activity date range is required'], trim: true },
    duration: { type: String, trim: true },
    category: {
      type: String,
      enum: ['Work', 'Education', 'Course', 'Award', 'Project', 'Other'],
      default: 'Work',
    },
    icon: { type: String, required: [true, 'Icon name is required'], default: 'Briefcase' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String },
    },
    fullDetails: { type: String },
    order: { type: Number, default: 0 },
    
    // Generic flags
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    isCurrent: { type: Boolean, default: false },

    // Work specific
    companyName: { type: String },
    employmentType: { type: String },
    location: { type: String },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    companyWebsite: { type: String },

    // Education specific
    degree: { type: String },
    department: { type: String },
    instituteName: { type: String },
    session: { type: String },
    cgpa: { type: String },
    academicAchievements: [{ type: String }],

    // Course specific
    platform: { type: String },
    instructor: { type: String },
    completionDate: { type: String },
    skillsLearned: [{ type: String }],
    credentialLink: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
