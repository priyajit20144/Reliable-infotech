import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseSecretKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  '';
const supabasePublishableKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

/**
 * Checks whether Supabase is configured with valid environment variables
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('your-project-ref') &&
    Boolean(supabaseSecretKey)
  );
};

/**
 * Supabase Admin client with service-role privileges for server operations
 */
export const supabaseAdmin: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseSecretKey : 'placeholder-secret-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: WebSocket as any,
    },
  }
);

/**
 * Diagnostic service to check Supabase connection and service health
 */
export const checkSupabaseHealth = async (): Promise<{
  configured: boolean;
  url: string;
  hasPublishableKey: boolean;
  hasSecretKey: boolean;
  status: 'connected' | 'unconfigured' | 'error';
  message: string;
  details?: any;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      url: supabaseUrl || 'Not configured',
      hasPublishableKey: Boolean(supabasePublishableKey),
      hasSecretKey: Boolean(supabaseSecretKey),
      status: 'unconfigured',
      message: 'Supabase URL is not configured or still using placeholder.',
    };
  }

  try {
    // Attempt pinging Supabase storage or auth endpoint
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      return {
        configured: true,
        url: supabaseUrl,
        hasPublishableKey: Boolean(supabasePublishableKey),
        hasSecretKey: Boolean(supabaseSecretKey),
        status: 'error',
        message: `Supabase returned error: ${error.message}`,
        details: error,
      };
    }

    return {
      configured: true,
      url: supabaseUrl,
      hasPublishableKey: Boolean(supabasePublishableKey),
      hasSecretKey: Boolean(supabaseSecretKey),
      status: 'connected',
      message: 'Supabase connected successfully.',
      details: { bucketsCount: data.length },
    };
  } catch (err: any) {
    return {
      configured: true,
      url: supabaseUrl,
      hasPublishableKey: Boolean(supabasePublishableKey),
      hasSecretKey: Boolean(supabaseSecretKey),
      status: 'error',
      message: err?.message || 'Failed to connect to Supabase',
    };
  }
};

export const SUPABASE_JWT_KEY_ID =
  process.env.SUPABASE_JWT_KEY_ID || '5175BA28-799C-4933-87A0-C8D07E302B1F';
export const SUPABASE_JWKS_URL =
  process.env.SUPABASE_JWKS_URL ||
  (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : '');

// Initialize JWKS remote key set for verifying ES256 / ECC P-256 JWTs
let remoteJWKS: any = null;
if (SUPABASE_JWKS_URL && isSupabaseConfigured()) {
  try {
    const { createRemoteJWKSet } = await import('jose');
    remoteJWKS = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));
  } catch (err) {
    // Dynamic import will initialize on demand
  }
}

/**
 * Verifies an incoming Supabase JWT token signed with the active ECC key
 */
export const verifySupabaseJWT = async (token: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // 1. Attempt verification using the Supabase Auth API
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data?.user) {
      return {
        user: data.user,
        claims: {
          sub: data.user.id,
          email: data.user.email,
          role: data.user.role,
          app_metadata: data.user.app_metadata,
          user_metadata: data.user.user_metadata,
        },
      };
    }
  } catch (_e) {
    // Continue to cryptographic fallback
  }

  // 2. Cryptographic JWKS verification (offline ECC ES256 verification)
  try {
    const { createRemoteJWKSet, jwtVerify } = await import('jose');
    if (!remoteJWKS && SUPABASE_JWKS_URL) {
      remoteJWKS = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));
    }
    if (remoteJWKS) {
      const { payload, protectedHeader } = await jwtVerify(token, remoteJWKS);
      return {
        user: {
          id: payload.sub as string,
          email: payload.email as string,
          role: payload.role as string,
        },
        claims: payload,
        header: protectedHeader,
      };
    }
  } catch (err: any) {
    throw new Error(`Supabase JWT verification failed: ${err.message}`);
  }

  throw new Error('Unable to verify Supabase JWT token');
};
