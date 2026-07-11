import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  publicId?: string;
  type: 'resume' | 'pdf' | 'presentation' | 'other';
  tags: string[];
  isProtected: boolean;
  category: string;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required'],
    },
    publicId: {
      type: String,
    },
    type: {
      type: String,
      enum: ['resume', 'pdf', 'presentation', 'other'],
      default: 'pdf',
    },
    tags: {
      type: [String],
      default: [],
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Document category is required'],
      trim: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
