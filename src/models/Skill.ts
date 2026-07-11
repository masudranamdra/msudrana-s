import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  description: string;
  icon: string; 
  colorTheme: string; // e.g., 'blue', 'purple', 'emerald', 'rose', 'amber'
  coreCompetencies: {
    name: string;
    icon: string;
  }[];
  tools: {
    name: string;
    icon: string;
    level: number;
    color: string;
  }[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: [true, 'Skill category title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Main icon identifier is required'],
      trim: true,
    },
    colorTheme: {
      type: String,
      required: [true, 'Color theme is required'],
      default: 'blue',
      trim: true,
    },
    coreCompetencies: [
      {
        name: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    tools: [
      {
        name: { type: String, required: true },
        icon: { type: String, required: true },
        level: { type: Number, required: true, min: 0, max: 100 },
        color: { type: String, required: true }, // e.g. 'text-cyan-500'
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
