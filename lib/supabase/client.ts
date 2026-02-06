import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cache clients by token to avoid multiple GoTrueClient instances
const clientCache = new Map<string, SupabaseClient<Database>>();

export function createClientSupabase(token?: string) {
  const cacheKey = token ?? '__anon__';
  const cached = clientCache.get(cacheKey);
  if (cached) return cached;
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: { persistSession: false }
  });
  clientCache.set(cacheKey, client);
  return client;
}
