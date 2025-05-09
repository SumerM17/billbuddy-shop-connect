
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Supabase client configuration with the actual values
const supabaseUrl = 'https://xqlskoaqsyxrzyowjvrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbHNrb2Fxc3l4cnp5b3dqdnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NjQ4MDMsImV4cCI6MjA2MjM0MDgwM30.7avriUQDTNSDhL1QmVAkkhhuxamndxs4Lr8ZnUeN_TI';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper to check authentication status
export const checkAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
