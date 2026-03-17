import { useCallback, useEffect } from 'react';
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { DraftRow } from '@/lib/supabase';
import { useIdentityContext } from '@/components/draft/IdentityContext';
import { DraftInput, DraftSchema } from '@/lib/schemas';
import { UseFormReset } from 'react-hook-form';
import { getChangedFields } from '@/lib/utils';

export function useDraftRealtime(draftId: string, reset: UseFormReset<DraftInput>): void {
  const { supabase } = useIdentityContext();

  // Handle incoming realtime updates
  const handleRealtimeUpdate = useCallback(
    (newRow: DraftRow, oldRow: Partial<DraftRow>) => {
      const changedFields = getChangedFields(newRow, oldRow);
      const strippedDraft = DraftSchema.partial().parse(changedFields);
      console.log('Received realtime update:', strippedDraft);
      reset(strippedDraft, { keepDirty: true, keepTouched: true });
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
        { event: 'UPDATE', schema: 'public', table: 'drafts', filter: `id=eq.${draftId}` },
        (payload: RealtimePostgresUpdatePayload<DraftRow>) => handleRealtimeUpdate(payload.new, payload.old),
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, draftId, handleRealtimeUpdate]);
}
