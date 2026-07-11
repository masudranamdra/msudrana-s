import { Router } from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), upload.single('coverImage'), createBlog);
router.put('/:id', protect, restrictTo('admin'), upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, restrictTo('admin'), deleteBlog);

export default router;
