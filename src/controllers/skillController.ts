import { Request, Response, NextFunction } from 'express';
import Skill from '../models/Skill';

// Get all skills
export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
};

// Create skill
export const createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// Update skill
export const updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// Delete skill
export const deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      res.status(404).json({ success: false, message: 'Skill not found' });
      return;
    }
    await skill.deleteOne();
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};
