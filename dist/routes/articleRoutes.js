"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleController_1 = require("../controllers/articleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get('/', articleController_1.getArticles);
// Protected Admin Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('previewImage'), articleController_1.createArticle);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('previewImage'), articleController_1.updateArticle);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), articleController_1.deleteArticle);
exports.default = router;
