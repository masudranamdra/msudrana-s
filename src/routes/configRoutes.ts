import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/configController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getConfig);

// Protected Admin Routes
router.put('/', protect, restrictTo('admin'), updateConfig);

export default router;
