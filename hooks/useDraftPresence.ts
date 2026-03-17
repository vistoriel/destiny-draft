import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useIdentityContext } from '@/components/draft';
import { DraftInput } from '@/lib/schemas';
import { debounce, throttle } from 'lodash';

export type TypingEventPayload = {
  field: DraftInputField;
  userType: 'master' | 'player' | 'anon';
};
export type DraftInputField = keyof DraftInput;
export type FieldStatus = 'idle' | 'typing' | 'busy' | 'error';
export type UseDraftPresenceCallbacks = {
  fieldTyping: (field: DraftInputField) => void;
  fieldIdle: (field: DraftInputField) => void;
  fieldError: (field: DraftInputField) => void;
}
export type UseDraftPresenceResult = {
  fieldStatuses: Record<DraftInputField, FieldStatus>;
  callbacks: UseDraftPresenceCallbacks;
};

export const draftFields: DraftInputField[] = [
  'title',
  'master_name',
  'description',
  'world',
  'basic_cards',
  'basic_experience',
];

export function useDraftPresence(draftId: string): UseDraftPresenceResult {
  // Get user type and supabase client from context
  const { userType, supabase } = useIdentityContext();

  // Ref to hold throttled broadcast functions
  const throttledBroadcastsRef = useRef<Record<DraftInputField, ReturnType<typeof throttle>>>(null);

  // State to track save status of each field
  const [fieldStatuses, setFieldStatuses] = useState(
    Object.fromEntries(draftFields.map(field => [field, 'idle'])) as Record<DraftInputField, FieldStatus>,
  );

  // Create debounced functions to reset field status to idle after a delay
  const debouncedBusyResets = useMemo(() => {
    const resets = {} as Record<DraftInputField, ReturnType<typeof debounce>>;
    draftFields.forEach(
      field => (resets[field] = debounce(() => setFieldStatuses(prev => ({ ...prev, [field]: 'idle' })), 5000)),
    );
    return resets;
  }, []);

  useEffect(() => {
    // Set up the realtime channel for presence updates
    const channelName = `draft:${draftId}`;
    const channel = supabase
      .channel(channelName, { config: { broadcast: { self: false } } })
      .on<TypingEventPayload>('broadcast', { event: 'typing' }, ({ payload }) => {
        console.log('Received typing event:', payload);
        setFieldStatuses(prev => ({ ...prev, [payload.field]: 'busy' }));
        debouncedBusyResets[payload.field]();
      })
      .subscribe();

    // Create throttled broadcast functions for each field
    const broadcasts = {} as Record<DraftInputField, ReturnType<typeof throttle>>;
    draftFields.forEach(field => {
      const payload = { field, userType: userType.type } satisfies TypingEventPayload;
      broadcasts[field] = throttle(() => channel.send({ type: 'broadcast', event: 'typing', payload }), 1000, {
        leading: true,
        trailing: false,
      });
    });
    throttledBroadcastsRef.current = broadcasts;

    // Cleanup on unmount
    return () => {
      Object.values(broadcasts).forEach(fn => fn?.cancel());
      supabase.removeChannel(channel);
    };
  }, [debouncedBusyResets, supabase, draftId, userType]);

  // Function to call when user starts typing in a field
  const fieldTyping = useCallback((field: DraftInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'typing' }));
    throttledBroadcastsRef.current?.[field]();
  }, []);

  // Function to call when field should be set to idle
  const fieldIdle = useCallback((field: DraftInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'idle' }));
  }, []);

  // Function to call when there is an error saving the field
  const fieldError = useCallback((field: DraftInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'error' }));
  }, []);

  return { fieldStatuses, callbacks: { fieldTyping, fieldIdle, fieldError } };
}
