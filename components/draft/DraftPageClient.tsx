'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { DraftHeader } from './DraftHeader';
import { DraftCharacters } from './DraftCharacters';
import { createClientSupabase } from '@/lib/supabase/client';
import { useDraftFormAutosave, useDraftRealtime } from '@/lib/hooks';
import type { Database } from '@/lib/supabase/database.types';

interface DraftPageClientProps {
  initialDraft: {
    id: string;
    title: string;
    master_name: string;
    description: string | null;
    world: string | null;
    basic_cards: number;
    basic_experience: number;
  };
  isMaster: boolean;
  token?: string;
}

export function DraftPageClient({ initialDraft, isMaster, token }: DraftPageClientProps) {
  // Create Supabase client
  const client = createClientSupabase(token);

  // Initialize form with initial draft values
  const form = useForm({
    defaultValues: {
      title: initialDraft.title,
      master_name: initialDraft.master_name,
      description: initialDraft.description ?? '',
      world: initialDraft.world ?? '',
      basic_cards: initialDraft.basic_cards,
      basic_experience: initialDraft.basic_experience,
    },
  });

  // Set up autosave for masters
  const { saveStatuses, updateServerState } = useDraftFormAutosave(
    form.watch,
    client,
    initialDraft.id,
    isMaster,
    {
      title: initialDraft.title,
      master_name: initialDraft.master_name,
      description: initialDraft.description ?? '',
      world: initialDraft.world ?? '',
      basic_cards: initialDraft.basic_cards,
      basic_experience: initialDraft.basic_experience,
    }
  );

  // Handle realtime updates from other users
  const handleRealtimeUpdate = useCallback((draft: Database['public']['Tables']['drafts']['Row']) => {
    console.log('Received realtime update:', draft);
    
    const newValues = {
      title: draft.title,
      master_name: draft.master_name,
      description: draft.description ?? '',
      world: draft.world ?? '',
      basic_cards: draft.basic_cards,
      basic_experience: draft.basic_experience,
    };

    // Update server state first to prevent autosave triggering
    updateServerState(newValues);
    
    // Then update form values - watch won't trigger save because server state matches
    form.reset(newValues, { keepDirty: true, keepTouched: true });
  }, [form, updateServerState]);

  // Subscribe to realtime updates
  useDraftRealtime(client, initialDraft.id, handleRealtimeUpdate);

  return (
    <>
      <DraftHeader
        className="px-12 pb-6 border-b border-stone-200"
        register={form.register}
        isMaster={isMaster}
        saveStatuses={saveStatuses}
      />
      <DraftCharacters className="px-12 pt-6" />
    </>
  );
}
