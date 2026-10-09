import { Router } from 'express';
import {
  getAiStatus,
  createEmbeddings,
  rerankDocuments,
} from '../controllers/aiController.js';

const router = Router();

// Status diagnostic endpoint
router.get('/status', getAiStatus);

// Generate vector embeddings using MongoDB Atlas Model API Gateway
router.post('/embeddings', createEmbeddings);

// Rerank documents for semantic search relevance
router.post('/rerank', rerankDocuments);

export default router;
