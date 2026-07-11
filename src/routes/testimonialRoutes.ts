import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getTestimonials);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('avatar'), createTestimonial);
router.put('/:id', protect, restrictTo('admin'), upload.single('avatar'), updateTestimonial);
router.delete('/:id', protect, restrictTo('admin'), deleteTestimonial);

export default router;
