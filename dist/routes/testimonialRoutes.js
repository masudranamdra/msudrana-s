"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonialController_1 = require("../controllers/testimonialController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get('/', testimonialController_1.getTestimonials);
// Protected Admin Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('avatar'), testimonialController_1.createTestimonial);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('avatar'), testimonialController_1.updateTestimonial);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), testimonialController_1.deleteTestimonial);
exports.default = router;
