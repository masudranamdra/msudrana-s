import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  url: string;
  publicId?: string;
  isProtected: boolean; // True requires login
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Image category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
    },
    isProtected: {
      type: Boolean,
      default: false,
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

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
