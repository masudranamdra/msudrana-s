import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
} from '../controllers/documentController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getDocuments);
router.get('/:id/download', downloadDocument);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('file'), createDocument);
router.put('/:id', protect, restrictTo('admin'), upload.single('file'), updateDocument);
router.delete('/:id', protect, restrictTo('admin'), deleteDocument);

export default router;
