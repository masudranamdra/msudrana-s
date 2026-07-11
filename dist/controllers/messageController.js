"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.updateMessageStatus = exports.createMessage = exports.getMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const emailService_1 = require("../services/emailService");
// Get all messages (Admin Only)
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessages = getMessages;
// Submit message (Public route)
const createMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.status(400).json({ success: false, message: 'Please provide all required fields' });
            return;
        }
        const newMessage = await Message_1.default.create({
            name,
            email,
            subject,
            message,
        });
        // Send async email notification
        // Uses sendContactNotification which catches its own errors internally to avoid disrupting responses
        await (0, emailService_1.sendContactNotification)(name, email, subject, message);
        res.status(201).json({
            success: true,
            message: 'Message sent successfully. Thank you!',
            data: newMessage,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createMessage = createMessage;
// Mark message as read/unread (Admin Only)
const updateMessageStatus = async (req, res, next) => {
    try {
        const { isRead } = req.body;
        const messageObj = await Message_1.default.findByIdAndUpdate(req.params.id, { isRead }, { new: true, runValidators: true });
        if (!messageObj) {
            res.status(404).json({ success: false, message: 'Message not found' });
            return;
        }
        res.status(200).json({ success: true, data: messageObj });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMessageStatus = updateMessageStatus;
// Delete message (Admin Only)
const deleteMessage = async (req, res, next) => {
    try {
        const messageObj = await Message_1.default.findById(req.params.id);
        if (!messageObj) {
            res.status(404).json({ success: false, message: 'Message not found' });
            return;
        }
        await messageObj.deleteOne();
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessage = deleteMessage;
