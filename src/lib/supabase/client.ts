'use client';

import { createClient } from '@supabase/supabase-js';

// Browser-side Supabase client using ANON KEY
// Safe to expose to client — respects RLS
let client: ReturnType<typeof createClient> | null = null;

export function createBrowserClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

// Singleton for convenience
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
