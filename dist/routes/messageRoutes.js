"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public contact submission
router.post('/', messageController_1.createMessage);
// Protected Admin Routes
router.get('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), messageController_1.getMessages);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), messageController_1.updateMessageStatus);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), messageController_1.deleteMessage);
exports.default = router;
