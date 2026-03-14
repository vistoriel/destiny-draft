import { useEffect, useState, useCallback, useMemo } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useIdentityContext } from '@/components/draft';
import { DraftInput, DraftSchema } from '../schemas';
import { debounce } from 'lodash';

const autosaveDelayMs = parseInt(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS || '1000', 10);

export type DraftInputField = keyof DraftInput;
export type FieldStatus = 'idle' | 'saving' | 'saved' | 'error';
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
      const { error } = await supabase
        .from('drafts')
        .update({ [fieldName]: value })
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

  useEffect(() => {
    // register watch subscription
    const subscription = watch((value, { name, type }) => {
      // check if user is master and field name is valid
      if (userType.type !== 'master') return;
      if (!name || !type) return;

      // validate the field value
      const fieldSchema = DraftSchema.pick({ [name]: true } as Record<DraftInputField, true>);
      const result = fieldSchema.safeParse({ [name]: value[name] });
      if (!result.success) return setFieldStatuses(prev => ({ ...prev, [name]: 'error' }));

      // update status and start the debounce timer
      setFieldStatuses(prev => ({ ...prev, [name]: 'saving' }));
      debouncedSaves[name](result.data[name]);
    });

    // cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [watch, debouncedSaves, userType]);

  return { fieldStatuses };
}
