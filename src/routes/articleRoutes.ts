import { Router } from 'express';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../controllers/articleController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getArticles);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('previewImage'), createArticle);
router.put('/:id', protect, restrictTo('admin'), upload.single('previewImage'), updateArticle);
router.delete('/:id', protect, restrictTo('admin'), deleteArticle);

export default router;
