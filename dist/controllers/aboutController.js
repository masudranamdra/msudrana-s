"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAbout = exports.getAbout = void 0;
const About_1 = __importDefault(require("../models/About"));
// I will write a simple controller that fetches and updates the single About document.
const getAbout = async (req, res) => {
    try {
        let about = await About_1.default.findOne();
        if (!about) {
            about = await About_1.default.create({});
        }
        res.status(200).json({ success: true, data: about });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
exports.getAbout = getAbout;
const updateAbout = async (req, res) => {
    try {
        const aboutData = req.body;
        let about = await About_1.default.findOne();
        if (about) {
            about = await About_1.default.findByIdAndUpdate(about._id, aboutData, {
                new: true,
                runValidators: true,
            });
        }
        else {
            about = await About_1.default.create(aboutData);
        }
        res.status(200).json({ success: true, data: about, message: 'About section updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error updating About section', error: error.message });
    }
};
exports.updateAbout = updateAbout;
