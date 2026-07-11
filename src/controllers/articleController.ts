import { Request, Response, NextFunction } from 'express';
import Article from '../models/Article';
import { uploadFile, deleteFile } from '../services/cloudinaryService';

// Get all articles
export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured, category } = req.query;
    const query: any = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    next(error);
  }
};

// Create article
export const createArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let previewImageInfo = { url: '', publicId: '' };

    if (req.file) {
      const result = await uploadFile(req.file, 'articles');
      previewImageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.previewImageUrl) {
      previewImageInfo = { url: req.body.previewImageUrl, publicId: '' };
    } else {
      res.status(400).json({ success: false, message: 'Article preview image is required' });
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

    const articleData = {
      ...req.body,
      previewImage: previewImageInfo,
      tags: tags || [],
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
    };

    const article = await Article.create(articleData);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// Update article
export const updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    let previewImageInfo = article.previewImage;

    if (req.file) {
      if (article.previewImage && article.previewImage.publicId) {
        await deleteFile(article.previewImage.publicId);
      }
      const result = await uploadFile(req.file, 'articles');
      previewImageInfo = { url: result.url, publicId: result.publicId || '' };
    } else if (req.body.previewImageUrl) {
      previewImageInfo = { url: req.body.previewImageUrl, publicId: '' };
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
      previewImage: previewImageInfo,
    };

    if (tags) {
      updateData.tags = tags;
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }

    article = await Article.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// Delete article
export const deleteArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    if (article.previewImage && article.previewImage.publicId) {
      await deleteFile(article.previewImage.publicId);
    }

    await article.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};
