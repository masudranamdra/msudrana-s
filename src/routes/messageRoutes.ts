import { Router } from 'express';
import {
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public contact submission
router.post('/', createMessage);

// Protected Admin Routes
router.get('/', protect, restrictTo('admin'), getMessages);
router.put('/:id', protect, restrictTo('admin'), updateMessageStatus);
router.delete('/:id', protect, restrictTo('admin'), deleteMessage);

export default router;
