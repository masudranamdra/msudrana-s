"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.updateVideo = exports.createVideo = exports.getVideos = exports.deleteImage = exports.updateImage = exports.createImage = exports.getImages = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Image_1 = __importDefault(require("../models/Image"));
const Video_1 = __importDefault(require("../models/Video"));
const cloudinaryService_1 = require("../services/cloudinaryService");
// Helper to determine if requester is logged in
const getIsAuthenticated = (req) => {
    let token;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token || token === 'none')
        return false;
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            return false;
        jsonwebtoken_1.default.verify(token, jwtSecret);
        return true;
    }
    catch {
        return false;
    }
};
/* =========================================================================
   IMAGES CRUD
   ========================================================================= */
// Get all images (filters out protected ones for public users)
const getImages = async (req, res, next) => {
    try {
        const isAuthenticated = getIsAuthenticated(req);
        const { featured, category } = req.query;
        const query = {};
        if (!isAuthenticated) {
            query.isProtected = false;
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (category) {
            query.category = category;
        }
        const images = await Image_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: images.length, data: images });
    }
    catch (error) {
        next(error);
    }
};
exports.getImages = getImages;
// Create gallery image
const createImage = async (req, res, next) => {
    try {
        let imageUrl = '';
        let publicId = '';
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'gallery');
            imageUrl = result.url;
            publicId = result.publicId || '';
        }
        else if (req.body.url) {
            imageUrl = req.body.url;
        }
        else {
            res.status(400).json({ success: false, message: 'Image file or URL is required' });
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
        const imageData = {
            ...req.body,
            url: imageUrl,
            publicId,
            tags: tags || [],
            isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
            order: req.body.order ? parseInt(req.body.order, 10) : 0,
        };
        const image = await Image_1.default.create(imageData);
        res.status(201).json({ success: true, data: image });
    }
    catch (error) {
        next(error);
    }
};
exports.createImage = createImage;
// Update gallery image
const updateImage = async (req, res, next) => {
    try {
        let image = await Image_1.default.findById(req.params.id);
        if (!image) {
            res.status(404).json({ success: false, message: 'Image not found' });
            return;
        }
        let imageUrl = image.url;
        let publicId = image.publicId;
        if (req.file) {
            if (image.publicId) {
                await (0, cloudinaryService_1.deleteFile)(image.publicId);
            }
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'gallery');
            imageUrl = result.url;
            publicId = result.publicId || '';
        }
        else if (req.body.url) {
            imageUrl = req.body.url;
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
        image = await Image_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: image });
    }
    catch (error) {
        next(error);
    }
};
exports.updateImage = updateImage;
// Delete gallery image
const deleteImage = async (req, res, next) => {
    try {
        const image = await Image_1.default.findById(req.params.id);
        if (!image) {
            res.status(404).json({ success: false, message: 'Image not found' });
            return;
        }
        if (image.publicId) {
            await (0, cloudinaryService_1.deleteFile)(image.publicId);
        }
        await image.deleteOne();
        res.status(200).json({ success: true, message: 'Image deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteImage = deleteImage;
/* =========================================================================
   VIDEOS CRUD
   ========================================================================= */
// Get all videos (filters out protected ones for public users)
const getVideos = async (req, res, next) => {
    try {
        const isAuthenticated = getIsAuthenticated(req);
        const { featured } = req.query;
        const query = {};
        if (!isAuthenticated) {
            query.isProtected = false;
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }
        const videos = await Video_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: videos.length, data: videos });
    }
    catch (error) {
        next(error);
    }
};
exports.getVideos = getVideos;
// Create gallery video
const createVideo = async (req, res, next) => {
    try {
        const videoData = {
            ...req.body,
            isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
            order: req.body.order ? parseInt(req.body.order, 10) : 0,
        };
        const video = await Video_1.default.create(videoData);
        res.status(201).json({ success: true, data: video });
    }
    catch (error) {
        next(error);
    }
};
exports.createVideo = createVideo;
// Update gallery video
const updateVideo = async (req, res, next) => {
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
        const video = await Video_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }
        res.status(200).json({ success: true, data: video });
    }
    catch (error) {
        next(error);
    }
};
exports.updateVideo = updateVideo;
// Delete gallery video
const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video_1.default.findById(req.params.id);
        if (!video) {
            res.status(404).json({ success: false, message: 'Video not found' });
            return;
        }
        await video.deleteOne();
        res.status(200).json({ success: true, message: 'Video deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteVideo = deleteVideo;
