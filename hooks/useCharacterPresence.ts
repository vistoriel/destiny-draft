import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useIdentityContext } from '@/components/draft';
import { CharacterInput } from '@/lib/schemas';
import { debounce, throttle } from 'lodash';
import { FieldStatus } from './useDraftPresence';

export type CharacterTypingEventPayload = {
  field: CharacterInputField;
  userType: 'master' | 'player' | 'anon';
};
export type CharacterInputField = keyof CharacterInput;
export type UseCharacterPresenceCallbacks = {
  fieldTyping: (field: CharacterInputField) => void;
  fieldIdle: (field: CharacterInputField) => void;
  fieldError: (field: CharacterInputField) => void;
}
export type UseCharacterPresenceResult = {
  fieldStatuses: Record<CharacterInputField, FieldStatus>;
  callbacks: UseCharacterPresenceCallbacks;
};

export const characterFields: CharacterInputField[] = [
  'name',
  'player_name',
  'physical_damage',
  'mental_damage',
  'shock_level',
  'role',
  'sign',
  'extra_cards',
  'extra_experience',
];

export function useCharacterPresence(characterId: string): UseCharacterPresenceResult {
  // Get user type and supabase client from context
  const { userType, supabase } = useIdentityContext();

  // Ref to hold throttled broadcast functions
  const throttledBroadcastsRef = useRef<Record<CharacterInputField, ReturnType<typeof throttle>>>(null);

  // State to track save status of each field
  const [fieldStatuses, setFieldStatuses] = useState(
    Object.fromEntries(characterFields.map(field => [field, 'idle'])) as Record<CharacterInputField, FieldStatus>,
  );

  // Create debounced functions to reset field status to idle after a delay
  const debouncedBusyResets = useMemo(() => {
    const resets = {} as Record<CharacterInputField, ReturnType<typeof debounce>>;
    characterFields.forEach(
      field => (resets[field] = debounce(() => setFieldStatuses(prev => ({ ...prev, [field]: 'idle' })), 5000)),
    );
    return resets;
  }, []);

  useEffect(() => {
    // Set up the realtime channel for presence updates
    const channelName = `character:${characterId}`;
    const channel = supabase
      .channel(channelName, { config: { broadcast: { self: false } } })
      .on<CharacterTypingEventPayload>('broadcast', { event: 'typing' }, ({ payload }) => {
        console.log('Received typing event:', payload);
        setFieldStatuses(prev => ({ ...prev, [payload.field]: 'busy' }));
        debouncedBusyResets[payload.field]();
      })
      .subscribe();

    // Create throttled broadcast functions for each field
    const broadcasts = {} as Record<CharacterInputField, ReturnType<typeof throttle>>;
    characterFields.forEach(field => {
      const payload = { field, userType: userType.type } satisfies CharacterTypingEventPayload;
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
  }, [debouncedBusyResets, supabase, characterId, userType]);

  // Function to call when user starts typing in a field
  const fieldTyping = useCallback((field: CharacterInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'typing' }));
    throttledBroadcastsRef.current?.[field]();
  }, []);

  // Function to call when field should be set to idle
  const fieldIdle = useCallback((field: CharacterInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'idle' }));
  }, []);

  // Function to call when there is an error saving the field
  const fieldError = useCallback((field: CharacterInputField) => {
    setFieldStatuses(prev => ({ ...prev, [field]: 'error' }));
  }, []);

  return { fieldStatuses, callbacks: { fieldTyping, fieldIdle, fieldError } };
}
