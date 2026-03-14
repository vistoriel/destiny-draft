import { useCallback, useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { DraftRow } from '../supabase';
import { useIdentityContext } from '@/components/draft/IdentityContext';
import { DraftInput, DraftSchema } from '../schemas';
import { UseFormReset } from 'react-hook-form';

export function useDraftRealtime(draftId: string, reset: UseFormReset<DraftInput>): void {
  const { supabase } = useIdentityContext();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleRealtimeUpdate = useCallback(
    (draft: DraftRow) => {
      console.log('Received realtime update:', draft);
      reset(DraftSchema.parse(draft), { keepDirty: true, keepTouched: true });
    },
    [reset],
  );

  useEffect(() => {
    console.log(`Subscribing to realtime channel.`);
    // Set up the subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drafts',
          filter: `id=eq.${draftId}`,
        },
        payload => handleRealtimeUpdate(payload.new as DraftRow),
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [supabase, draftId, handleRealtimeUpdate]);
}
