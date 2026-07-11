import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import { uploadFile, deleteFile } from '../services/cloudinaryService';

// Get all projects
export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured, category, search } = req.query;
    const query: any = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// Get single project
export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Create project
export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let imageInfo = { url: '', publicId: '' };

    if (req.file) {
      const result = await uploadFile(req.file, 'projects');
      imageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.imageUrl) {
      imageInfo = { url: req.body.imageUrl, publicId: '' };
    } else {
      res.status(400).json({ success: false, message: 'Project image is required' });
      return;
    }

    // Parse tags if sent as string (e.g. from FormData)
    let tags = req.body.tags;
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(',').map((t: string) => t.trim());
      }
    }

    const projectData = {
      ...req.body,
      image: imageInfo,
      tags: tags || [],
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      order: req.body.order ? parseInt(req.body.order, 10) : 0,
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    let imageInfo = project.image;

    if (req.file) {
      // Delete old file
      if (project.image && project.image.publicId) {
        await deleteFile(project.image.publicId);
      }
      // Upload new file
      const result = await uploadFile(req.file, 'projects');
      imageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.imageUrl) {
      imageInfo = { url: req.body.imageUrl, publicId: '' };
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
      image: imageInfo,
    };

    if (tags) {
      updateData.tags = tags;
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }
    if (req.body.order !== undefined) {
      updateData.order = parseInt(req.body.order, 10);
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Delete image from storage
    if (project.image && project.image.publicId) {
      await deleteFile(project.image.publicId);
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
