"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSkill = exports.updateSkill = exports.createSkill = exports.getSkills = void 0;
const Skill_1 = __importDefault(require("../models/Skill"));
// Get all skills
const getSkills = async (req, res, next) => {
    try {
        const skills = await Skill_1.default.find().sort({ order: 1, name: 1 });
        res.status(200).json({ success: true, count: skills.length, data: skills });
    }
    catch (error) {
        next(error);
    }
};
exports.getSkills = getSkills;
// Create skill
const createSkill = async (req, res, next) => {
    try {
        const skill = await Skill_1.default.create(req.body);
        res.status(201).json({ success: true, data: skill });
    }
    catch (error) {
        next(error);
    }
};
exports.createSkill = createSkill;
// Update skill
const updateSkill = async (req, res, next) => {
    try {
        const skill = await Skill_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!skill) {
            res.status(404).json({ success: false, message: 'Skill not found' });
            return;
        }
        res.status(200).json({ success: true, data: skill });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSkill = updateSkill;
// Delete skill
const deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill_1.default.findById(req.params.id);
        if (!skill) {
            res.status(404).json({ success: false, message: 'Skill not found' });
            return;
        }
        await skill.deleteOne();
        res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSkill = deleteSkill;
