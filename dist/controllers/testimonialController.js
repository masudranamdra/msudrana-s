"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
const cloudinaryService_1 = require("../services/cloudinaryService");
// Get all testimonials
const getTestimonials = async (req, res, next) => {
    try {
        const { featured } = req.query;
        const query = {};
        if (featured === 'true') {
            query.isFeatured = true;
        }
        const testimonials = await Testimonial_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    }
    catch (error) {
        next(error);
    }
};
exports.getTestimonials = getTestimonials;
// Create testimonial
const createTestimonial = async (req, res, next) => {
    try {
        let avatarInfo = { url: '', publicId: '' };
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'testimonials');
            avatarInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.avatarUrl) {
            avatarInfo = { url: req.body.avatarUrl, publicId: '' };
        }
        const testimonialData = {
            ...req.body,
            avatar: avatarInfo,
            rating: req.body.rating ? parseInt(req.body.rating, 10) : 5,
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
            order: req.body.order ? parseInt(req.body.order, 10) : 0,
        };
        const testimonial = await Testimonial_1.default.create(testimonialData);
        res.status(201).json({ success: true, data: testimonial });
    }
    catch (error) {
        next(error);
    }
};
exports.createTestimonial = createTestimonial;
// Update testimonial
const updateTestimonial = async (req, res, next) => {
    try {
        let testimonial = await Testimonial_1.default.findById(req.params.id);
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        let avatarInfo = testimonial.avatar;
        if (req.file) {
            if (testimonial.avatar && testimonial.avatar.publicId) {
                await (0, cloudinaryService_1.deleteFile)(testimonial.avatar.publicId);
            }
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'testimonials');
            avatarInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.avatarUrl) {
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
        testimonial = await Testimonial_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: testimonial });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTestimonial = updateTestimonial;
// Delete testimonial
const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial_1.default.findById(req.params.id);
        if (!testimonial) {
            res.status(404).json({ success: false, message: 'Testimonial not found' });
            return;
        }
        if (testimonial.avatar && testimonial.avatar.publicId) {
            await (0, cloudinaryService_1.deleteFile)(testimonial.avatar.publicId);
        }
        await testimonial.deleteOne();
        res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTestimonial = deleteTestimonial;
