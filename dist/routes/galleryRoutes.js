"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const galleryController_1 = require("../controllers/galleryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
// Images Endpoints
router.get('/images', galleryController_1.getImages);
router.post('/images', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), galleryController_1.createImage);
router.put('/images/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), galleryController_1.updateImage);
router.delete('/images/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), galleryController_1.deleteImage);
// Videos Endpoints
router.get('/videos', galleryController_1.getVideos);
router.post('/videos', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), galleryController_1.createVideo);
router.put('/videos/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), galleryController_1.updateVideo);
router.delete('/videos/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), galleryController_1.deleteVideo);
exports.default = router;
