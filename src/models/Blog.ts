import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: {
    url: string;
    publicId?: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    summary: {
      type: String,
      required: [true, 'Blog summary is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      url: {
        type: String,
        required: [true, 'Cover image URL is required'],
      },
      publicId: {
        type: String,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-validate slug logic (generate if empty)
BlogSchema.pre<IBlog>('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Full text indexing
BlogSchema.index({ title: 'text', content: 'text', summary: 'text' });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
