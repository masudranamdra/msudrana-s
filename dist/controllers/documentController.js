"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadDocument = exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocuments = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Document_1 = __importDefault(require("../models/Document"));
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
// Get all documents
const getDocuments = async (req, res, next) => {
    try {
        const isAuthenticated = getIsAuthenticated(req);
        const { category } = req.query;
        const query = {};
        if (!isAuthenticated) {
            query.isProtected = false;
        }
        if (category) {
            query.category = category;
        }
        const documents = await Document_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: documents.length, data: documents });
    }
    catch (error) {
        next(error);
    }
};
exports.getDocuments = getDocuments;
// Create document
const createDocument = async (req, res, next) => {
    try {
        let fileUrl = '';
        let publicId = '';
        if (req.file) {
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'documents');
            fileUrl = result.url;
            publicId = result.publicId || '';
        }
        else if (req.body.fileUrl) {
            fileUrl = req.body.fileUrl;
        }
        else {
            res.status(400).json({ success: false, message: 'Document file upload or URL is required' });
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
        const documentData = {
            ...req.body,
            fileUrl,
            publicId,
            tags: tags || [],
            isProtected: req.body.isProtected === 'true' || req.body.isProtected === true,
        };
        const doc = await Document_1.default.create(documentData);
        res.status(201).json({ success: true, data: doc });
    }
    catch (error) {
        next(error);
    }
};
exports.createDocument = createDocument;
// Update document
const updateDocument = async (req, res, next) => {
    try {
        let doc = await Document_1.default.findById(req.params.id);
        if (!doc) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }
        let fileUrl = doc.fileUrl;
        let publicId = doc.publicId;
        if (req.file) {
            if (doc.publicId) {
                await (0, cloudinaryService_1.deleteFile)(doc.publicId);
            }
            const result = await (0, cloudinaryService_1.uploadFile)(req.file, 'documents');
            fileUrl = result.url;
            publicId = result.publicId || '';
        }
        else if (req.body.fileUrl) {
            fileUrl = req.body.fileUrl;
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
            fileUrl,
            publicId,
        };
        if (tags) {
            updateData.tags = tags;
        }
        if (req.body.isProtected !== undefined) {
            updateData.isProtected = req.body.isProtected === 'true' || req.body.isProtected === true;
        }
        doc = await Document_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: doc });
    }
    catch (error) {
        next(error);
    }
};
exports.updateDocument = updateDocument;
// Delete document
const deleteDocument = async (req, res, next) => {
    try {
        const doc = await Document_1.default.findById(req.params.id);
        if (!doc) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }
        if (doc.publicId) {
            await (0, cloudinaryService_1.deleteFile)(doc.publicId);
        }
        await doc.deleteOne();
        res.status(200).json({ success: true, message: 'Document deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDocument = deleteDocument;
// Trigger download (increments count and redirects to file URL or sends directly)
const downloadDocument = async (req, res, next) => {
    try {
        const doc = await Document_1.default.findById(req.params.id);
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
    }
    catch (error) {
        next(error);
    }
};
exports.downloadDocument = downloadDocument;
