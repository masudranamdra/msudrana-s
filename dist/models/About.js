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
const StatSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String },
    colorClass: { type: String }
});
const LifestyleImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String }
});
const SocialLinkSchema = new mongoose_1.Schema({
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String },
    label: { type: String }
});
const AboutSchema = new mongoose_1.Schema({
    name: {
        type: String,
        default: 'John Doe',
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        default: 'My Journey & Mission',
    },
    subtitle: {
        type: String,
        required: [true, 'Subtitle is required'],
        default: 'Mission',
    },
    missionStatement: {
        type: String,
        default: 'I specialize in developing high-performance web applications using modern stacks.',
    },
    fullDescription: {
        type: String,
        default: 'From crafting complex database queries on robust servers to building client-rich interactive React interfaces, I strive to write clean, reusable, and secure code. I prioritize building modular components that are easy to maintain and scale.',
    },
    imageUrl: {
        type: String,
        default: '',
    },
    resumeUrl: {
        type: String,
        default: '',
    },
    professionalSummary: {
        type: String,
        default: '',
    },
    whoIAm: {
        type: String,
        default: '',
    },
    philosophy: {
        type: String,
        default: '',
    },
    coreValues: {
        type: [String],
        default: [],
    },
    currentFocus: {
        type: [String],
        default: [],
    },
    email: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    socialLinks: {
        type: [SocialLinkSchema],
        default: [],
    },
    stats: {
        type: [StatSchema],
        default: [],
    },
    highlights: {
        type: [String],
        default: [],
    },
    lifestyleText: {
        type: String,
        default: 'When I am not coding, I enjoy exploring the great outdoors and finding new coffee shops.'
    },
    dailyLifeActivities: {
        type: [String],
        default: []
    },
    lifestyleImages: {
        type: [LifestyleImageSchema],
        default: []
    },
    backgroundColor: {
        type: String,
        default: 'bg-[#F5F7FB] dark:bg-[#0F172A]',
    },
    textColor: {
        type: String,
        default: 'text-[#0F172A] dark:text-white',
    },
    accentColor: {
        type: String,
        default: 'text-[#2563EB] dark:text-blue-400',
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.About || mongoose_1.default.model('About', AboutSchema);
