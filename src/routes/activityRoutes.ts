import { Router } from 'express';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activityController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getActivities);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('image'), createActivity);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateActivity);
router.delete('/:id', protect, restrictTo('admin'), deleteActivity);

export default router;
