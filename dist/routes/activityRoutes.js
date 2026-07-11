"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityController_1 = require("../controllers/activityController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get('/', activityController_1.getActivities);
// Protected Admin Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), activityController_1.createActivity);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), activityController_1.updateActivity);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), activityController_1.deleteActivity);
exports.default = router;
