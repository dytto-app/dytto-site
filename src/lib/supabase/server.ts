import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
// Priority: VITE_ vars are the known-good originals from the original Netlify site
// NEXT_PUBLIC_ / SUPABASE_SERVICE_KEY may have been entered incorrectly — try last
export function createServerClient() {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.VITE_SUPABASE_ANON_KEY ||         // known-good, length ~208
    process.env.VITE_SUPABASE_SERVICE_KEY ||        // not set but try
    process.env.SUPABASE_SERVICE_KEY ||             // user-added, may be wrong
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;      // user-added, may be wrong (length 33)

  if (!supabaseUrl || !key) {
    throw new Error(
      `Missing Supabase credentials. URL: ${!!supabaseUrl}, Key: ${!!key}`
    );
  }

  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
