import { useCallback, useEffect } from 'react';
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { useIdentityContext } from '@/components/draft/IdentityContext';
import { FieldValues, UseFormReset } from 'react-hook-form';
import { getChangedFields } from '@/lib/utils';
import { ZodObject, ZodTypeAny } from 'zod';

export function useRealtime<TRow extends FieldValues, TInput extends FieldValues>(
  rowId: string,
  reset: UseFormReset<TInput>,
  zodSchema: ZodObject<Record<string, ZodTypeAny>>,
  table: string,
): void {
  const { supabase } = useIdentityContext();

  // Handle incoming realtime updates
  const handleRealtimeUpdate = useCallback(
    (newRow: TRow, oldRow: Partial<TRow>) => {
      const changedFields = getChangedFields(newRow, oldRow);
      const strippedDraft = zodSchema.partial().parse(changedFields);
      console.log('Received realtime update:', strippedDraft);
      reset(strippedDraft as TInput, { keepDirty: true, keepTouched: true });
    },
    [reset, zodSchema],
  );

  useEffect(() => {
    console.log(`Subscribing to realtime channel.`);

    // Set up the subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter: `id=eq.${rowId}` },
        (payload: RealtimePostgresUpdatePayload<TRow>) => handleRealtimeUpdate(payload.new, payload.old),
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, rowId, handleRealtimeUpdate, table]);
}
