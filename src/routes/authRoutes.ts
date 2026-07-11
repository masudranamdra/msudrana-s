import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  googleLogin,
  forgotPassword,
  updatePassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/google', googleLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/updatepassword', protect, updatePassword);

export default router;
