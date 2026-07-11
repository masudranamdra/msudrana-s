import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  image: {
    url: string;
    publicId?: string;
  };
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
    },
    demoLink: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Project image URL is required'],
      },
      publicId: {
        type: String,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexing for faster search queries
ProjectSchema.index({ title: 'text', description: 'text', category: 'text', tags: 'text' });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
