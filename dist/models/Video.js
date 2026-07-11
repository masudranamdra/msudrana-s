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
const VideoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    url: {
        type: String,
        required: [true, 'Video URL is required'],
        trim: true,
    },
    thumbnail: {
        type: String,
        required: [true, 'Video thumbnail is required'],
        default: '',
    },
    platform: {
        type: String,
        enum: ['youtube', 'vimeo', 'drive', 'other'],
        default: 'other',
    },
    isProtected: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Pre-save validation hooks to detect video platforms
VideoSchema.pre('save', function (next) {
    const url = this.url.toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        this.platform = 'youtube';
    }
    else if (url.includes('vimeo.com')) {
        this.platform = 'vimeo';
    }
    else if (url.includes('drive.google.com')) {
        this.platform = 'drive';
    }
    else {
        this.platform = 'other';
    }
    next();
});
exports.default = mongoose_1.default.models.Video || mongoose_1.default.model('Video', VideoSchema);
