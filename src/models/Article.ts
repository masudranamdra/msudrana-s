import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  externalLink: string;
  category: string;
  tags: string[];
  previewImage: {
    url: string;
    publicId?: string;
  };
  summary: string;
  isFeatured: boolean;
  source: string; // e.g. Medium, Dev.to, LinkedIn
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    externalLink: {
      type: String,
      required: [true, 'External article link is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Article category is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    previewImage: {
      url: {
        type: String,
        required: [true, 'Preview image URL is required'],
      },
      publicId: {
        type: String,
      },
    },
    summary: {
      type: String,
      required: [true, 'Article summary is required'],
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      required: [true, 'Article source (e.g. Medium, Dev.to) is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
