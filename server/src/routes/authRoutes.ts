import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);

// Password Reset Flow with OTP & Brevo Email verification
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.post('/reset-password', authRateLimiter, resetPassword);

export default router;

