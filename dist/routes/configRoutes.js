"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController_1 = require("../controllers/configController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', configController_1.getConfig);
// Protected Admin Routes
router.put('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), configController_1.updateConfig);
exports.default = router;
