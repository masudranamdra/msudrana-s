"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const cloudinaryService_1 = require("../services/cloudinaryService");
// Get all projects
const getProjects = async (req, res, next) => {
    try {
        const { featured, category, search } = req.query;
        const query = {};
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$text = { $search: search };
        }
        const projects = await Project_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
// Get single project
const getProject = async (req, res, next) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
// Create project
const createProject = async (req, res, next) => {
    try {
        let imageInfo = { url: '', publicId: '' };
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'projects');
            imageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.imageUrl) {
            imageInfo = { url: req.body.imageUrl, publicId: '' };
        }
        else {
            res.status(400).json({ success: false, message: 'Project image is required' });
            return;
        }
        // Parse tags if sent as string (e.g. from FormData)
        let tags = req.body.tags;
        if (typeof tags === 'string') {
            try {
                tags = JSON.parse(tags);
            }
            catch {
                tags = tags.split(',').map((t) => t.trim());
            }
        }
        const projectData = {
            ...req.body,
            image: imageInfo,
            tags: tags || [],
            isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
            order: req.body.order ? parseInt(req.body.order, 10) : 0,
        };
        const project = await Project_1.default.create(projectData);
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
// Update project
const updateProject = async (req, res, next) => {
    try {
        let project = await Project_1.default.findById(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        let imageInfo = project.image;
        if (req.file) {
            // Delete old file
            if (project.image && project.image.publicId) {
                await (0, cloudinaryService_1.deleteFile)(project.image.publicId);
            }
            // Upload new file
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'projects');
            imageInfo = { url: result.url, publicId: result.publicId || '' };
        }
        else if (req.body.imageUrl) {
            imageInfo = { url: req.body.imageUrl, publicId: '' };
        }
        // Parse tags if sent as string
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
        project = await Project_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
// Delete project
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }
        // Delete image from storage
        if (project.image && project.image.publicId) {
            await (0, cloudinaryService_1.deleteFile)(project.image.publicId);
        }
        await project.deleteOne();
        res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
