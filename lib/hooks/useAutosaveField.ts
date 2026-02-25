import { useState, useCallback, useRef, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseAutosaveFieldResult<T> {
  value: T;
  setValue: (value: T) => void;
  saveStatus: SaveStatus;
}

export function useAutosaveField<T>(
  client: SupabaseClient<Database>,
  draftId: string,
  fieldName: string,
  initialValue: T
): UseAutosaveFieldResult<T> {
  const [value, setValueState] = useState<T>(initialValue);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAutosaveDelay = useCallback(() => {
    const delayMs = process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS;
    return delayMs ? parseInt(delayMs, 10) : 500;
  }, []);

  const saveToSupabase = useCallback(
    async (valueToSave: T) => {
      try {
        setSaveStatus('saving');
        const { error } = await client
          .from('drafts')
          .update({ [fieldName]: valueToSave })
          .eq('id', draftId);

        if (error) {
          throw error;
        }

        setSaveStatus('saved');
        // Reset to idle after a brief delay to show the "saved" state
        // Clear any existing reset timeout first
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
          resetTimeoutRef.current = null;
        }, 1000);
      } catch (err) {
        console.error(`Failed to save ${fieldName}:`, err);
        setSaveStatus('error');
      }
    },
    [client, draftId, fieldName]
  );

  const setValue = useCallback(
    (newValue: T) => {
      // Update local state immediately (optimistic)
      setValueState(newValue);
      setSaveStatus('saving');

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new debounced save
      const delay = getAutosaveDelay();
      timeoutRef.current = setTimeout(() => {
        saveToSupabase(newValue);
        timeoutRef.current = null;
      }, delay);
    },
    [saveToSupabase, getAutosaveDelay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    setValue,
    saveStatus,
  };
}
