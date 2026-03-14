'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { UserType } from '@/lib/keys';
import { SupabaseClient } from '@supabase/supabase-js';

interface IdentityContextState {
  userType: UserType;
  supabase: SupabaseClient;
}

const IdentityContext = createContext<IdentityContextState | null>(null);

export function useIdentityContext() {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentityContext must be used within an IdentityProvider');
  }
  return context;
}

interface IdentityProviderProps {
  children: ReactNode;
  userType: UserType;
  token?: string;
}

export function IdentityProvider({ children, userType, token }: IdentityProviderProps) {
  const supabase = useMemo(() => createClientSupabase(token), [token]);
  const value = useMemo(() => ({ userType, supabase}), [userType, supabase]);

  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
}
