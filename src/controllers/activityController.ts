import { Request, Response, NextFunction } from 'express';
import Activity from '../models/Activity';
import { uploadFile, deleteFile } from '../services/cloudinaryService';

// Get all activities
export const getActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    const query: any = {};

    if (category) {
      query.category = category;
    }

    const activities = await Activity.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

// Create activity
export const createActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let imageInfo = { url: '', publicId: '' };

    if (req.file) {
      const result = await uploadFile(req.file, 'activities');
      imageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.imageUrl) {
      imageInfo = { url: req.body.imageUrl, publicId: '' };
    }

    const activityData = {
      ...req.body,
      image: imageInfo,
      order: req.body.order ? parseInt(req.body.order, 10) : 0,
    };

    const activity = await Activity.create(activityData);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// Update activity
export const updateActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let activity = await Activity.findById(req.params.id);
    if (!activity) {
      res.status(404).json({ success: false, message: 'Activity timeline event not found' });
      return;
    }

    let imageInfo = activity.image || { url: '', publicId: '' };

    if (req.file) {
      if (activity.image && activity.image.publicId) {
        await deleteFile(activity.image.publicId);
      }
      const result = await uploadFile(req.file, 'activities');
      imageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.imageUrl) {
      imageInfo = { url: req.body.imageUrl, publicId: '' };
    }

    const updateData = {
      ...req.body,
      image: imageInfo,
    };

    if (req.body.order !== undefined) {
      updateData.order = parseInt(req.body.order, 10);
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

// Delete activity
export const deleteActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      res.status(404).json({ success: false, message: 'Activity timeline event not found' });
      return;
    }

    if (activity.image && activity.image.publicId) {
      await deleteFile(activity.image.publicId);
    }

    await activity.deleteOne();
    res.status(200).json({ success: true, message: 'Activity timeline event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
