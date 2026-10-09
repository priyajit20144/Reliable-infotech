import { Router } from 'express';
import { createInquiry, getMyInquiries } from '../controllers/inquiryController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createInquiry);
router.get('/my', authenticate, getMyInquiries);

export default router;
