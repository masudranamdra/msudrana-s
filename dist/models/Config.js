"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ConfigSchema = new mongoose_1.Schema({
    heroTitle: {
        type: String,
        required: [true, 'Hero Title is required'],
        default: 'I am a Professional Software Engineer',
    },
    heroSubtitle: {
        type: String,
        required: [true, 'Hero Subtitle is required'],
        default: 'Building premium digital products, apps, and SaaS applications with Next.js and Node.js.',
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    resumeUrl: {
        type: String,
        default: '',
    },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        youtube: { type: String, default: '' },
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        dribbble: { type: String, default: '' },
        medium: { type: String, default: '' },
    },
    siteDescription: {
        type: String,
        default: 'Welcome to my professional portfolio management system.',
    },
    seoKeywords: {
        type: [String],
        default: ['portfolio', 'saas', 'nextjs', 'developer'],
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact Email is required'],
        default: 'admin@example.com',
    },
    contactPhone: {
        type: String,
        default: '',
    },
    contactAddress: {
        type: String,
        default: '',
    },
    siteLogo: {
        type: String,
        default: '',
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Config || mongoose_1.default.model('Config', ConfigSchema);
