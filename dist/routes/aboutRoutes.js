"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aboutController_1 = require("../controllers/aboutController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public route to get About data
router.get('/', aboutController_1.getAbout);
// Admin route to update About data
router.put('/', authMiddleware_1.protect, (0, authMiddleware_1.restrictTo)('admin'), aboutController_1.updateAbout);
exports.default = router;
