"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get('/', projectController_1.getProjects);
router.get('/:id', projectController_1.getProject);
// Protected Admin Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), projectController_1.createProject);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('image'), projectController_1.updateProject);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), projectController_1.deleteProject);
exports.default = router;
