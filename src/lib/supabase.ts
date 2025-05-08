
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anonymous Key is missing. Please check your environment variables.');
}

export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string
);

// Helper to check authentication status
export const checkAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
