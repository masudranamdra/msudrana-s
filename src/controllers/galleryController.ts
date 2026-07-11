import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Image from '../models/Image';
import Video from '../models/Video';
import { uploadFile, deleteFile } from '../services/cloudinaryService';

// Helper to determine if requester is logged in
const getIsAuthenticated = (req: Request): boolean => {
  let token: string | undefined;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'none') return false;

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return false;
    jwt.verify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
};

/* =========================================================================
   IMAGES CRUD
   ========================================================================= */

// Get all images (filters out protected ones for public users)
export const getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuthenticated = getIsAuthenticated(req);
    const { featured, category } = req.query;
    
    const query: any = {};
    if (!isAuthenticated) {
      query.isProtected = false;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (category) {
      query.category = category;
    }

    const images = await Image.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// Create gallery image
export const createImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      const result = await uploadFile(req.file, 'gallery');
      imageUrl = result.url;
      publicId = result.publicId || '';
    } else if (req.body.url) {
      imageUrl = req.body.url;
    } else {
      res.status(400).json({ success: false, message: 'Image file or URL is required' });
      return;
    }

    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(',').map((t: string) => t.trim());
      }
    }

    const imageData = {
      ...req.body,
      url: imageUrl,
      publicId,
      tags: tags || [],
      isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      order: req.body.order ? parseInt(req.body.order, 10) : 0,
    };

    const image = await Image.create(imageData);
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// Update gallery image
export const updateImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ success: false, message: 'Image not found' });
      return;
    }

    let imageUrl = image.url;
    let publicId = image.publicId;

    if (req.file) {
      if (image.publicId) {
        await deleteFile(image.publicId);
      }
      const result = await uploadFile(req.file, 'gallery');
      imageUrl = result.url;
      publicId = result.publicId || '';
    } else if (req.body.url) {
      imageUrl = req.body.url;
    }

    let tags = req.body.tags;
    if (tags && typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(',').map((t: string) => t.trim());
      }
    }

    const updateData = {
      ...req.body,
      url: imageUrl,
      publicId,
    };

    if (tags) {
      updateData.tags = tags;
    }
    if (req.body.isProtected !== undefined) {
      updateData.isProtected = req.body.isProtected === 'true' || req.body.isProtected === true;
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.order !== undefined) {
      updateData.order = parseInt(req.body.order, 10);
    }

    image = await Image.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// Delete gallery image
export const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ success: false, message: 'Image not found' });
      return;
    }

    if (image.publicId) {
      await deleteFile(image.publicId);
    }

    await image.deleteOne();
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/* =========================================================================
   VIDEOS CRUD
   ========================================================================= */

// Get all videos (filters out protected ones for public users)
export const getVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuthenticated = getIsAuthenticated(req);
    const { featured } = req.query;

    const query: any = {};
    if (!isAuthenticated) {
      query.isProtected = false;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const videos = await Video.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    next(error);
  }
};

// Create gallery video
export const createVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const videoData = {
      ...req.body,
      isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      order: req.body.order ? parseInt(req.body.order, 10) : 0,
    };

    const video = await Video.create(videoData);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// Update gallery video
export const updateVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData = { ...req.body };

    if (req.body.isProtected !== undefined) {
      updateData.isProtected = req.body.isProtected === 'true' || req.body.isProtected === true;
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.order !== undefined) {
      updateData.order = parseInt(req.body.order, 10);
    }

    const video = await Video.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!video) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    next(error);
  }
};

// Delete gallery video
export const deleteVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }
    await video.deleteOne();
    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};
