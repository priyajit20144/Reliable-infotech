import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, requireRole(['ADMIN', 'TEAM_MEMBER']), createProject);
router.patch('/:id', authenticate, requireRole(['ADMIN', 'TEAM_MEMBER']), updateProject);
router.delete('/:id', authenticate, requireRole(['ADMIN', 'TEAM_MEMBER']), deleteProject);

export default router;
