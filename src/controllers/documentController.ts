import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Document from '../models/Document';
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

// Get all documents
export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isAuthenticated = getIsAuthenticated(req);
    const { category } = req.query;

    const query: any = {};
    if (!isAuthenticated) {
      query.isProtected = false;
    }
    if (category) {
      query.category = category;
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    next(error);
  }
};

// Create document
export const createDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let fileUrl = '';
    let publicId = '';

    if (req.file) {
      const result = await uploadFile(req.file, 'documents');
      fileUrl = result.url;
      publicId = result.publicId || '';
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
    } else {
      res.status(400).json({ success: false, message: 'Document file upload or URL is required' });
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

    const documentData = {
      ...req.body,
      fileUrl,
      publicId,
      tags: tags || [],
      isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
    };

    const doc = await Document.create(documentData);
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

// Update document
export const updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    let fileUrl = doc.fileUrl;
    let publicId = doc.publicId;

    if (req.file) {
      if (doc.publicId) {
        await deleteFile(doc.publicId);
      }
      const result = await uploadFile(req.file, 'documents');
      fileUrl = result.url;
      publicId = result.publicId || '';
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
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
      fileUrl,
      publicId,
    };

    if (tags) {
      updateData.tags = tags;
    }
    if (req.body.isProtected !== undefined) {
      updateData.isProtected = req.body.isProtected === 'true' || req.body.isProtected === true;
    }

    doc = await Document.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

// Delete document
export const deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    if (doc.publicId) {
      await deleteFile(doc.publicId);
    }

    await doc.deleteOne();
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Trigger download (increments count and redirects to file URL or sends directly)
export const downloadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Double check authorization if resource is protected
    if (doc.isProtected) {
      const isAuthenticated = getIsAuthenticated(req);
      if (!isAuthenticated) {
        res.status(401).json({ success: false, message: 'Not authorized to download this resource' });
        return;
      }
    }

    // Increment count
    doc.downloadCount = (doc.downloadCount || 0) + 1;
    await doc.save();

    // Redirect to the actual file URL (whether Cloudinary or static folder)
    let url = doc.fileUrl;
    if (url.startsWith('/uploads/')) {
      const host = process.env.CLIENT_URL || 'http://localhost:5000';
      // If it is served locally, redirect to full URL
      url = `${host}${url}`;
    }
    
    res.redirect(url);
  } catch (error) {
    next(error);
  }
};
