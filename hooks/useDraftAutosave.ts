import { useEffect, useCallback, useMemo } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useIdentityContext } from '@/components/draft';
import { DraftInput, DraftSchema } from '@/lib/schemas';
import { debounce } from 'lodash';
import { draftFields, DraftInputField, UseDraftPresenceCallbacks } from './useDraftPresence';

const autosaveDelayMs = parseInt(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS || '1000', 10);

export function useDraftAutosave(
  draftId: string,
  watch: UseFormWatch<DraftInput>,
  { fieldError, fieldIdle, fieldTyping }: UseDraftPresenceCallbacks,
) {
  // get user type and supabase client from context
  const { userType, supabase } = useIdentityContext();

  // function to perform the actual save to Supabase
  const performSave = useCallback(
    async (fieldName: DraftInputField, value: string | number) => {
      // validate the field value
      const fieldSchema = DraftSchema.pick({ [fieldName]: true } as Record<DraftInputField, true>);
      const result = fieldSchema.safeParse({ [fieldName]: value });
      if (!result.success) return fieldError(fieldName);

      // perform the update in Supabase
      const { error } = await supabase
        .from('drafts')
        .update({ [fieldName]: result.data[fieldName] })
        .eq('id', draftId);
      if (!error) return fieldIdle(fieldName);
      console.error('Error saving draft:', error);
      fieldError(fieldName);
    },
    [supabase, draftId, fieldError, fieldIdle],
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

  useEffect(() => {
    // register watch subscription
    const subscription = watch((value, { name, type }) => {
      // check if user is master and field name is valid
      if (userType.type !== 'master') return;
      if (!name || !type) return;
      
      //TODO: if (fieldStatuses[name as DraftInputField] === 'busy') return;

      // update status and start the debounce timer
      fieldTyping(name);
      debouncedSaves[name](value[name]);
    });

    // cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, debouncedSaves, userType, supabase, draftId, fieldTyping]);
}
