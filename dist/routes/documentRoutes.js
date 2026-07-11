"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.get('/', documentController_1.getDocuments);
router.get('/:id/download', documentController_1.downloadDocument);
// Protected Admin Routes
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('file'), documentController_1.createDocument);
router.put('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), multer_1.upload.single('file'), documentController_1.updateDocument);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), documentController_1.deleteDocument);
exports.default = router;
