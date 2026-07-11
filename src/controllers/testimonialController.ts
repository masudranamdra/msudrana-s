import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';
import { uploadFile, deleteFile } from '../services/cloudinaryService';

// Get all testimonials
export const getTestimonials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured } = req.query;
    const query: any = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// Create testimonial
export const createTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let avatarInfo = { url: '', publicId: '' };

    if (req.file) {
      const result = await uploadFile(req.file, 'testimonials');
      avatarInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.avatarUrl) {
      avatarInfo = { url: req.body.avatarUrl, publicId: '' };
    }

    const testimonialData = {
      ...req.body,
      avatar: avatarInfo,
      rating: req.body.rating ? parseInt(req.body.rating, 10) : 5,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      order: req.body.order ? parseInt(req.body.order, 10) : 0,
    };

    const testimonial = await Testimonial.create(testimonialData);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// Update testimonial
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }

    let avatarInfo = testimonial.avatar;

    if (req.file) {
      if (testimonial.avatar && testimonial.avatar.publicId) {
        await deleteFile(testimonial.avatar.publicId);
      }
      const result = await uploadFile(req.file, 'testimonials');
      avatarInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.avatarUrl) {
      avatarInfo = { url: req.body.avatarUrl, publicId: '' };
    }

    const updateData = {
      ...req.body,
      avatar: avatarInfo,
    };

    if (req.body.rating !== undefined) {
      updateData.rating = parseInt(req.body.rating, 10);
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.order !== undefined) {
      updateData.order = parseInt(req.body.order, 10);
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// Delete testimonial
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }

    if (testimonial.avatar && testimonial.avatar.publicId) {
      await deleteFile(testimonial.avatar.publicId);
    }

    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
