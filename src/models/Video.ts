import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'vimeo' | 'drive' | 'other';
  isProtected: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Video thumbnail is required'],
      default: '',
    },
    platform: {
      type: String,
      enum: ['youtube', 'vimeo', 'drive', 'other'],
      default: 'other',
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

// Pre-save validation hooks to detect video platforms
VideoSchema.pre<IVideo>('save', function (next) {
  const url = this.url.toLowerCase();
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    this.platform = 'youtube';
  } else if (url.includes('vimeo.com')) {
    this.platform = 'vimeo';
  } else if (url.includes('drive.google.com')) {
    this.platform = 'drive';
  } else {
    this.platform = 'other';
  }
  next();
});

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
