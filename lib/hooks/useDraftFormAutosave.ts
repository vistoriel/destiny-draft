import { useEffect, useRef, useState, useCallback } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface DraftFormData {
  title: string;
  master_name: string;
  description: string;
  world: string;
  basic_cards: number;
  basic_experience: number;
}

type DraftField = keyof DraftFormData;

export function useDraftFormAutosave(
  watch: UseFormWatch<DraftFormData>,
  client: SupabaseClient<Database>,
  draftId: string,
  isMaster: boolean,
  initialValues: DraftFormData
) {
  const [saveStatuses, setSaveStatuses] = useState<Record<DraftField, SaveStatus>>({
    title: 'idle',
    master_name: 'idle',
    description: 'idle',
    world: 'idle',
    basic_cards: 'idle',
    basic_experience: 'idle',
  });

  // Track the last known server state to prevent saving our own realtime updates
  const serverStateRef = useRef<DraftFormData>(initialValues);
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});
  const resetTimeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  const getAutosaveDelay = useCallback(() => {
    const delayMs = process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS;
    return delayMs ? parseInt(delayMs, 10) : 1000;
  }, []);

  const saveToSupabase = useCallback(
    async (fieldName: DraftField, value: string | number) => {
      try {
        setSaveStatuses((prev) => ({ ...prev, [fieldName]: 'saving' }));

        const { error } = await client
          .from('drafts')
          .update({ [fieldName]: value })
          .eq('id', draftId);

        if (error) {
          throw error;
        }

        // Update server state to match what we just saved
        serverStateRef.current = { ...serverStateRef.current, [fieldName]: value };

        setSaveStatuses((prev) => ({ ...prev, [fieldName]: 'saved' }));

        // Reset to idle after showing "saved" state
        if (resetTimeoutRefs.current[fieldName]) {
          clearTimeout(resetTimeoutRefs.current[fieldName]!);
        }
        resetTimeoutRefs.current[fieldName] = setTimeout(() => {
          setSaveStatuses((prev) => ({ ...prev, [fieldName]: 'idle' }));
          resetTimeoutRefs.current[fieldName] = null;
        }, getAutosaveDelay() * 2);
      } catch (err) {
        console.error(`Failed to save ${fieldName}:`, err);
        setSaveStatuses((prev) => ({ ...prev, [fieldName]: 'error' }));
      }
    },
    [client, draftId, getAutosaveDelay]
  );

  useEffect(() => {
    if (!isMaster) return;

    // Copy refs to local variables at the start of the effect
    const timeouts = timeoutRefs.current;
    const resetTimeouts = resetTimeoutRefs.current;

    const subscription = watch((value, { name }) => {
      if (!name) return;

      const fieldName = name as DraftField;
      const fieldValue = value[fieldName];

      if (fieldValue === undefined) return;

      // Skip if value hasn't changed from server state (prevents infinite loop from realtime updates)
      if (serverStateRef.current[fieldName] === fieldValue) {
        return;
      }

      console.log('User changed field:', fieldName, 'from', serverStateRef.current[fieldName], 'to', fieldValue);

      // Clear any pending timeout for this field
      if (timeouts[fieldName]) {
        clearTimeout(timeouts[fieldName]!);
      }

      // Set status to saving immediately
      setSaveStatuses((prev) => ({ ...prev, [fieldName]: 'saving' }));

      // Set new debounced save
      const delay = getAutosaveDelay();
      timeouts[fieldName] = setTimeout(() => {
        saveToSupabase(fieldName, fieldValue);
        timeouts[fieldName] = null;
      }, delay);
    });

    return () => {
      subscription.unsubscribe();
      // Clear all timeouts
      Object.values(timeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      Object.values(resetTimeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [watch, isMaster, saveToSupabase, getAutosaveDelay]);

  // Expose method to update server state when realtime updates arrive
  const updateServerState = useCallback((newState: Partial<DraftFormData>) => {
    serverStateRef.current = { ...serverStateRef.current, ...newState };
  }, []);

  return { saveStatuses, updateServerState };
}
