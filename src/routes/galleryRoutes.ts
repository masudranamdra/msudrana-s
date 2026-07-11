import { Router } from 'express';
import {
  getImages,
  createImage,
  updateImage,
  deleteImage,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/galleryController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { upload } from '../middleware/multer';

const router = Router();

// Images Endpoints
router.get('/images', getImages);
router.post('/images', protect, restrictTo('admin'), upload.single('image'), createImage);
router.put('/images/:id', protect, restrictTo('admin'), upload.single('image'), updateImage);
router.delete('/images/:id', protect, restrictTo('admin'), deleteImage);

// Videos Endpoints
router.get('/videos', getVideos);
router.post('/videos', protect, restrictTo('admin'), createVideo);
router.put('/videos/:id', protect, restrictTo('admin'), updateVideo);
router.delete('/videos/:id', protect, restrictTo('admin'), deleteVideo);

export default router;
