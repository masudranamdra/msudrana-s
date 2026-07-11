"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticles = void 0;
const Article_1 = __importDefault(require("../models/Article"));
const cloudinaryService_1 = require("../services/cloudinaryService");
// Get all articles
const getArticles = async (req, res, next) => {
    try {
        const { featured, category } = req.query;
        const query = {};
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (category) {
            query.category = category;
        }
        const articles = await Article_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: articles.length, data: articles });
    }
    catch (error) {
        next(error);
    }
};
exports.getArticles = getArticles;
// Create article
const createArticle = async (req, res, next) => {
    try {
        let previewImageInfo = { url: '', publicId: '' };
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'articles');
            previewImageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.previewImageUrl) {
            previewImageInfo = { url: req.body.previewImageUrl, publicId: '' };
        }
        else {
            res.status(400).json({ success: false, message: 'Article preview image is required' });
            return;
        }
        let tags = req.body.tags;
        if (typeof tags === 'string') {
            try {
                tags = JSON.parse(tags);
            }
            catch {
                tags = tags.split(',').map((t) => t.trim());
            }
        }
        const articleData = {
            ...req.body,
            previewImage: previewImageInfo,
            tags: tags || [],
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
        };
        const article = await Article_1.default.create(articleData);
        res.status(201).json({ success: true, data: article });
    }
    catch (error) {
        next(error);
    }
};
exports.createArticle = createArticle;
// Update article
const updateArticle = async (req, res, next) => {
    try {
        let article = await Article_1.default.findById(req.params.id);
        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }
        let previewImageInfo = article.previewImage;
        if (req.file) {
            if (article.previewImage && article.previewImage.publicId) {
                await (0, cloudinaryService_1.deleteFile)(article.previewImage.publicId);
            }
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'articles');
            previewImageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.previewImageUrl) {
            previewImageInfo = { url: req.body.previewImageUrl, publicId: '' };
        }
        let tags = req.body.tags;
        if (tags && typeof tags === 'string') {
            try {
                tags = JSON.parse(tags);
            }
            catch {
                tags = tags.split(',').map((t) => t.trim());
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
        article = await Article_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: article });
    }
    catch (error) {
        next(error);
    }
};
exports.updateArticle = updateArticle;
// Delete article
const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article_1.default.findById(req.params.id);
        if (!article) {
            res.status(404).json({ success: false, message: 'Article not found' });
            return;
        }
        if (article.previewImage && article.previewImage.publicId) {
            await (0, cloudinaryService_1.deleteFile)(article.previewImage.publicId);
        }
        await article.deleteOne();
        res.status(200).json({ success: true, message: 'Article deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteArticle = deleteArticle;
