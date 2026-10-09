import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllRequests,
  deleteCustomRequest,
  updateRequestStatus,
  assignRequestTeam,
  getAllInquiries,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Strictly guard all admin endpoints
router.use(authenticate, requireRole(['ADMIN', 'TEAM_MEMBER']));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);
router.delete('/requests/:id', deleteCustomRequest);
router.patch('/requests/:id/status', updateRequestStatus);
router.patch('/requests/:id/assign', assignRequestTeam);
router.get('/inquiries', getAllInquiries);

export default router;
