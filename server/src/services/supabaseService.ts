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
