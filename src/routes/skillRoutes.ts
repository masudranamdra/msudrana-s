import { Router } from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getSkills);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), createSkill);
router.put('/:id', protect, restrictTo('admin'), updateSkill);
router.delete('/:id', protect, restrictTo('admin'), deleteSkill);

export default router;
