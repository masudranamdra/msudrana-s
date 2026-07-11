"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("../config/cloudinary");
const uploadFile = async (file, folder = 'portfolio') => {
    if (cloudinary_1.isCloudinaryConfigured) {
        try {
            // Use temp file path created by multer to upload to Cloudinary
            const result = await cloudinary_1.cloudinary.uploader.upload(file.path, {
                folder: folder,
                resource_type: 'auto',
            });
            // Delete temp file after upload
            if (fs_1.default.existsSync(file.path)) {
                fs_1.default.unlinkSync(file.path);
            }
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            console.error('Cloudinary upload error, falling back to local storage:', error.message);
            // Fallback to local storage if Cloudinary fails
        }
    }
    // Local static storage fallback
    const uploadDir = path_1.default.join(process.cwd(), 'public', 'uploads');
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    // Create a unique filename
    const extension = path_1.default.extname(file.originalname);
    const baseName = path_1.default.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${baseName}_${Date.now()}${extension}`;
    const targetPath = path_1.default.join(uploadDir, fileName);
    // If multer configured diskStorage, copy or rename from temp file path
    if (fs_1.default.existsSync(file.path)) {
        fs_1.default.renameSync(file.path, targetPath);
    }
    else if (file.buffer) {
        fs_1.default.writeFileSync(targetPath, file.buffer);
    }
    else {
        throw new Error('No file contents found to write to local storage');
    }
    // Return local static path. We will serve /uploads/ path in App
    const host = process.env.CLIENT_URL || 'http://localhost:5000';
    const url = `/uploads/${fileName}`; // serve relative, frontend can append host or let proxy handle it
    return {
        url,
        publicId: fileName,
    };
};
exports.uploadFile = uploadFile;
const deleteFile = async (publicId) => {
    if (!publicId)
        return false;
    if (cloudinary_1.isCloudinaryConfigured && !publicId.includes('.')) {
        try {
            const result = await cloudinary_1.cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        }
        catch (error) {
            console.error('Cloudinary delete error:', error.message);
            return false;
        }
    }
    // Local delete fallback
    try {
        const filePath = path_1.default.join(process.cwd(), 'public', 'uploads', publicId);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
    }
    catch (error) {
        console.error('Local file delete error:', error.message);
    }
    return false;
};
exports.deleteFile = deleteFile;
