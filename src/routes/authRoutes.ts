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
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Registration and login - open but email validation happens in controller
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.post('/google', googleLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/updatepassword', protect, updatePassword);

export default router;
