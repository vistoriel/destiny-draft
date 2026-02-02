import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export async function createServerSupabase(draftId: string) {
  const cookieStore = await cookies();
  
  // 1. Get the Keyring Cookie
  const tokensCookie = cookieStore.get('draft_tokens');
  const tokens = tokensCookie?.value ? JSON.parse(decodeURIComponent(tokensCookie.value)) : {};
  
  // 2. Get the specific JWT for this draft
  const token = tokens[draftId];

  // 3. Create client with that token
  // If token is missing, it will default to 'anon' (and likely be blocked by RLS)
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: {
      persistSession: false, // We manage tokens ourselves
      autoRefreshToken: false,
    }
  });
}
