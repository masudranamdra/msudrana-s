import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Public route to get About data
router.get('/', getAbout);

// Admin route to update About data
router.put('/', protect, restrictTo('admin'), updateAbout);

export default router;
