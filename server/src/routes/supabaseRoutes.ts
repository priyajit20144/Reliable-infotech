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

/**
 * GET /api/supabase/jwt-info
 * Returns status of the active JWT Key ID and verifies against the live JWKS endpoint
 */
router.get('/jwt-info', async (_req: Request, res: Response) => {
  const activeKeyId = process.env.SUPABASE_JWT_KEY_ID || '5175BA28-799C-4933-87A0-C8D07E302B1F';
  const jwksUrl = process.env.SUPABASE_JWKS_URL || 'https://tdsbiknxuvgkqrrhjfmd.supabase.co/auth/v1/.well-known/jwks.json';

  try {
    const response = await fetch(jwksUrl);
    const jwksData: any = await response.json();
    const activeKeyFound = jwksData.keys?.some((k: any) => k.kid?.toLowerCase() === activeKeyId.toLowerCase());

    return res.json({
      success: true,
      data: {
        activeKeyId,
        algorithm: 'ES256',
        keyType: 'ECC (P-256)',
        jwksUrl,
        activeKeyVerifiedOnJwks: activeKeyFound,
        availableKeysCount: jwksData.keys?.length || 0,
        keys: jwksData.keys,
      },
    });
  } catch (err: any) {
    return res.json({
      success: true,
      data: {
        activeKeyId,
        algorithm: 'ES256',
        jwksUrl,
        warning: `Could not reach JWKS: ${err.message}`,
      },
    });
  }
});

export default router;
