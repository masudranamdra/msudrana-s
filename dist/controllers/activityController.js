"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteActivity = exports.updateActivity = exports.createActivity = exports.getActivities = void 0;
const Activity_1 = __importDefault(require("../models/Activity"));
const cloudinaryService_1 = require("../services/cloudinaryService");
// Get all activities
const getActivities = async (req, res, next) => {
    try {
        const { category } = req.query;
        const query = {};
        if (category) {
            query.category = category;
        }
        const activities = await Activity_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: activities.length, data: activities });
    }
    catch (error) {
        next(error);
    }
};
exports.getActivities = getActivities;
// Create activity
const createActivity = async (req, res, next) => {
    try {
        let imageInfo = { url: '', publicId: '' };
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'activities');
            imageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.imageUrl) {
            imageInfo = { url: req.body.imageUrl, publicId: '' };
        }
        const activityData = {
            ...req.body,
            image: imageInfo,
            order: req.body.order ? parseInt(req.body.order, 10) : 0,
        };
        const activity = await Activity_1.default.create(activityData);
        res.status(201).json({ success: true, data: activity });
    }
    catch (error) {
        next(error);
    }
};
exports.createActivity = createActivity;
// Update activity
const updateActivity = async (req, res, next) => {
    try {
        let activity = await Activity_1.default.findById(req.params.id);
        if (!activity) {
            res.status(404).json({ success: false, message: 'Activity timeline event not found' });
            return;
        }
        let imageInfo = activity.image || { url: '', publicId: '' };
        if (req.file) {
            if (activity.image && activity.image.publicId) {
                await (0, cloudinaryService_1.deleteFile)(activity.image.publicId);
            }
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'activities');
            imageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.imageUrl) {
            imageInfo = { url: req.body.imageUrl, publicId: '' };
        }
        const updateData = {
            ...req.body,
            image: imageInfo,
        };
        if (req.body.order !== undefined) {
            updateData.order = parseInt(req.body.order, 10);
        }
        activity = await Activity_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: activity });
    }
    catch (error) {
        next(error);
    }
};
exports.updateActivity = updateActivity;
// Delete activity
const deleteActivity = async (req, res, next) => {
    try {
        const activity = await Activity_1.default.findById(req.params.id);
        if (!activity) {
            res.status(404).json({ success: false, message: 'Activity timeline event not found' });
            return;
        }
        if (activity.image && activity.image.publicId) {
            await (0, cloudinaryService_1.deleteFile)(activity.image.publicId);
        }
        await activity.deleteOne();
        res.status(200).json({ success: true, message: 'Activity timeline event deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteActivity = deleteActivity;
