import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { uploadFile, deleteFile } from '../services/cloudinaryService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Get all blogs
export const getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured, published, category, search } = req.query;
    const query: any = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }
    // Public routes should only see published blogs
    if (published === 'true') {
      query.isPublished = true;
    } else if (published === 'false') {
      query.isPublished = false;
    }

    if (category) {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug or ID
export const getBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    let blog;

    // Check if it's a valid MongoDB ObjectId, if so try finding by ID first
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(idOrSlug).populate('author', 'username avatar email');
    }

    // If not found by ID or not an ObjectId, query by slug
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug }).populate('author', 'username avatar email');
    }

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// Create blog post
export const createBlog = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let coverImageInfo = { url: '', publicId: '' };

    if (req.file) {
      const result = await uploadFile(req.file, 'blogs');
      coverImageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.coverImageUrl) {
      coverImageInfo = { url: req.body.coverImageUrl, publicId: '' };
    } else {
      res.status(400).json({ success: false, message: 'Cover image is required' });
      return;
    }

    // Parse tags if sent as string
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(',').map((t: string) => t.trim());
      }
    }

    if (!req.user) {
      res.status(401).json({ success: false, message: 'User unauthorized' });
      return;
    }

    const blogData = {
      ...req.body,
      coverImage: coverImageInfo,
      tags: tags || [],
      author: req.user._id,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// Update blog post
export const updateBlog = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    let coverImageInfo = blog.coverImage;

    if (req.file) {
      // Delete old file
      if (blog.coverImage && blog.coverImage.publicId) {
        await deleteFile(blog.coverImage.publicId);
      }
      // Upload new file
      const result = await uploadFile(req.file, 'blogs');
      coverImageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.coverImageUrl) {
      coverImageInfo = { url: req.body.coverImageUrl, publicId: '' };
    }

    // Parse tags if sent as string
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
      coverImage: coverImageInfo,
    };

    if (tags) {
      updateData.tags = tags;
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.isPublished !== undefined) {
      updateData.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
    }

    // If title has changed, trigger slug regeneration in model validation
    if (req.body.title && req.body.title !== blog.title && !req.body.slug) {
      updateData.slug = ''; // triggers model slug auto-gen
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// Delete blog post
export const deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    // Delete image from storage
    if (blog.coverImage && blog.coverImage.publicId) {
      await deleteFile(blog.coverImage.publicId);
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
