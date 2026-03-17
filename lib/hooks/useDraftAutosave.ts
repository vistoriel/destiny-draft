import { useEffect, useState, useCallback, useMemo } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useIdentityContext } from '@/components/draft';
import { DraftInput, DraftSchema } from '../schemas';
import { debounce, throttle } from 'lodash';
import { RealtimeChannel } from '@supabase/supabase-js';

const autosaveDelayMs = parseInt(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS || '1000', 10);

export type TypingEventPayload = {
  field: DraftInputField;
  userType: 'master' | 'player' | 'anon';
};
export type DraftInputField = keyof DraftInput;
export type FieldStatus = 'idle' | 'typing' | 'busy' | 'error';

const draftFields: DraftInputField[] = [
  'title',
  'master_name',
  'description',
  'world',
  'basic_cards',
  'basic_experience',
];

export function useDraftAutosave(draftId: string, watch: UseFormWatch<DraftInput>) {
  // get user type and supabase client from context
  const { userType, supabase } = useIdentityContext();

  // state to track save status of each field
  const [fieldStatuses, setFieldStatuses] = useState(
    Object.fromEntries(draftFields.map(field => [field, 'idle'])) as Record<DraftInputField, FieldStatus>,
  );

  // function to perform the actual save to Supabase
  const performSave = useCallback(
    async (fieldName: DraftInputField, value: string | number) => {
      // validate the field value
      const fieldSchema = DraftSchema.pick({ [fieldName]: true } as Record<DraftInputField, true>);
      const result = fieldSchema.safeParse({ [fieldName]: value });
      if (!result.success) return setFieldStatuses(prev => ({ ...prev, [fieldName]: 'error' }));

      // perform the update in Supabase
      const { error } = await supabase
        .from('drafts')
        .update({ [fieldName]: result.data[fieldName] })
        .eq('id', draftId);
      if (!error) return setFieldStatuses(prev => ({ ...prev, [fieldName]: 'idle' }));
      console.error('Error saving draft:', error);
      setFieldStatuses(prev => ({ ...prev, [fieldName]: 'error' }));
    },
    [supabase, draftId],
  );

  // create debounced save functions for each field
  const debouncedSaves = useMemo(() => {
    const saves = {} as Record<DraftInputField, ReturnType<typeof debounce>>;
    draftFields.forEach(field => {
      saves[field] = debounce((value: string | number) => {
        performSave(field, value);
      }, autosaveDelayMs);
    });
    return saves;
  }, [performSave]);

  const debouncedBroadcasts = useMemo(() => {
    const saves = {} as Record<DraftInputField, ReturnType<typeof debounce>>;
    draftFields.forEach(field => {
      saves[field] = throttle(
        (channel: RealtimeChannel) => {
          channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { field, userType: userType.type } satisfies TypingEventPayload,
          });
        },
        1000,
        { leading: true, trailing: false },
      );
    });
    return saves;
  }, [userType]);

  const debouncedBusy = useMemo(() => {
    const saves = {} as Record<DraftInputField, ReturnType<typeof debounce>>;
    draftFields.forEach(field => {
      saves[field] = debounce(() => setFieldStatuses(prev => ({ ...prev, [field]: 'idle' })), 5000);
    });
    return saves;
  }, []);

  useEffect(() => {
    const channelName = `draft:${draftId}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    channel
      .on<TypingEventPayload>('broadcast', { event: 'typing' }, ({ payload }) => {
        console.log('Received typing event:', payload);
        setFieldStatuses(prev => ({ ...prev, [payload.field]: 'busy' }));
        debouncedBusy[payload.field]();
      })
      .subscribe();

    // register watch subscription
    const subscription = watch((value, { name, type }) => {
      // check if user is master and field name is valid
      if (userType.type !== 'master') return;
      if (!name || !type) return;
      //if (fieldStatuses[name as DraftInputField] === 'busy') return;

      // update status and start the debounce timer
      setFieldStatuses(prev => ({ ...prev, [name]: 'typing' }));
      debouncedBroadcasts[name](channel);
      debouncedSaves[name](value[name]);
    });

    // cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [watch, debouncedSaves, userType, debouncedBroadcasts, supabase, draftId, debouncedBusy]);

  return { fieldStatuses };
}
