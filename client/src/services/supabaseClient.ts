import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

/**
 * Checks if Supabase client is properly configured with a live project URL
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('your-project-ref') &&
    Boolean(supabaseKey)
  );
};

// Singleton Supabase client instance (or null dummy if unconfigured)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Helper to upload a file to a Supabase storage bucket
 */
export const uploadStorageFile = async (
  bucket: string,
  filePath: string,
  file: File | Blob
) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please supply VITE_SUPABASE_URL in your .env file.');
  }

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) throw error;
  return data;
};

/**
 * Helper to get a public URL for a file stored in Supabase storage
 */
export const getStoragePublicUrl = (bucket: string, filePath: string): string => {
  if (!isSupabaseConfigured()) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};
