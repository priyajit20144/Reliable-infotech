import { Router } from 'express';
import {
  createCustomRequest,
  getMyRequests,
  getRequestById,
} from '../controllers/requestController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuthenticate, createCustomRequest);
router.get('/my', authenticate, getMyRequests);
router.get('/:id', authenticate, getRequestById);

export default router;
