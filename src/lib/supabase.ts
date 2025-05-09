
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Supabase client configuration
// We'll provide default values for development to avoid the application from crashing
// In production, these should be properly set up in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Only log missing environment variables in development
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.error('Supabase URL or Anonymous Key is missing. Please check your environment variables.');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  console.error('You can find these values in your Supabase project settings under API settings.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper to check authentication status
export const checkAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
