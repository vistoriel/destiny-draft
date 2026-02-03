import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { getDraftToken } from '../session';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export async function createServerSupabase(draftId: string) {
  const token  = await getDraftToken(draftId);
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}
