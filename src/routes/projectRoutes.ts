import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('image'), createProject);
router.put('/:id', protect, restrictTo('admin'), upload.single('image'), updateProject);
router.delete('/:id', protect, restrictTo('admin'), deleteProject);

export default router;
