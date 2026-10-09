import { Router, Request, Response } from 'express';
import {
  checkSupabaseHealth,
  isSupabaseConfigured,
  supabaseAdmin,
} from '../services/supabaseService.js';

const router = Router();

/**
 * GET /api/supabase/status
 * Returns connection diagnostic info for the Supabase integration
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const health = await checkSupabaseHealth();
    return res.json({
      success: true,
      data: health,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to inspect Supabase health',
    });
  }
});

/**
 * GET /api/supabase/public-config
 * Safely returns public keys & URL needed by frontend clients
 */
router.get('/public-config', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      isConfigured: isSupabaseConfigured(),
    },
  });
});

/**
 * GET /api/supabase/buckets
 * Lists storage buckets (requires configured secret key)
 */
router.get('/buckets', async (_req: Request, res: Response) => {
  if (!isSupabaseConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Supabase is not configured yet. Please provide SUPABASE_URL in server/.env',
    });
  }

  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.json({ success: true, buckets: data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

export default router;
