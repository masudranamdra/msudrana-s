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
const SkillSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Skill category title is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    icon: {
        type: String,
        required: [true, 'Main icon identifier is required'],
        trim: true,
    },
    colorTheme: {
        type: String,
        required: [true, 'Color theme is required'],
        default: 'blue',
        trim: true,
    },
    coreCompetencies: [
        {
            name: { type: String, required: true },
            icon: { type: String, required: true },
        },
    ],
    tools: [
        {
            name: { type: String, required: true },
            icon: { type: String, required: true },
            level: { type: Number, required: true, min: 0, max: 100 },
            color: { type: String, required: true }, // e.g. 'text-cyan-500'
        },
    ],
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Skill || mongoose_1.default.model('Skill', SkillSchema);
