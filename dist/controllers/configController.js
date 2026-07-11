"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = exports.getConfig = void 0;
const Config_1 = __importDefault(require("../models/Config"));
// Get current configuration (or create default if none exists)
const getConfig = async (req, res, next) => {
    try {
        let config = await Config_1.default.findOne();
        if (!config) {
            config = await Config_1.default.create({
                heroTitle: 'I am a Professional Software Engineer',
                heroSubtitle: 'Building premium digital products, apps, and SaaS applications with Next.js and Node.js.',
                contactEmail: 'admin@example.com',
                socialLinks: {
                    github: 'https://github.com',
                    linkedin: 'https://linkedin.com',
                    twitter: 'https://twitter.com',
                },
            });
            console.log('Default system configuration initialized.');
        }
        res.status(200).json({ success: true, data: config });
    }
    catch (error) {
        next(error);
    }
};
exports.getConfig = getConfig;
// Update configuration (Admin Only)
const updateConfig = async (req, res, next) => {
    try {
        let config = await Config_1.default.findOne();
        if (!config) {
            config = await Config_1.default.create(req.body);
        }
        else {
            config = await Config_1.default.findByIdAndUpdate(config._id, req.body, {
                new: true,
                runValidators: true,
            });
        }
        res.status(200).json({ success: true, data: config });
    }
    catch (error) {
        next(error);
    }
};
exports.updateConfig = updateConfig;
