import { Request, Response, NextFunction } from 'express';
import Config, { IConfig } from '../models/Config';

// Get current configuration (or create default if none exists)
export const getConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({
        heroTitle: 'I am a Professional Software Engineer',
        heroSubtitle: 'Building premium digital products, apps, and SaaS applications with Next.js and Node.js.',
        contactEmail: 'admin@example.com',
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
      });
      console.log('Default system configuration initialized.');
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

// Update configuration (Admin Only)
export const updateConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create(req.body);
    } else {
      config = await Config.findByIdAndUpdate(config._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};
