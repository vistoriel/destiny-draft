import { useEffect, useCallback, useMemo } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { useIdentityContext } from '@/components/draft';
import { CharacterInput, CharacterSchema } from '@/lib/schemas';
import { debounce } from 'lodash';
import { characterFields, CharacterInputField, UseCharacterPresenceCallbacks } from './useCharacterPresence';

const autosaveDelayMs = parseInt(process.env.NEXT_PUBLIC_AUTOSAVE_DELAY_MS || '1000', 10);

export function useCharacterAutosave(
  characterId: string,
  watch: UseFormWatch<CharacterInput>,
  { fieldError, fieldIdle, fieldTyping }: UseCharacterPresenceCallbacks,
) {
  // get user type and supabase client from context
  const { userType, supabase } = useIdentityContext();

  // function to perform the actual save to Supabase
  const performSave = useCallback(
    async (fieldName: CharacterInputField, value: string | number) => {
      // validate the field value
      const fieldSchema = CharacterSchema.pick({ [fieldName]: true } as Record<CharacterInputField, true>);
      const result = fieldSchema.safeParse({ [fieldName]: value });
      if (!result.success) return fieldError(fieldName);

      // perform the update in Supabase
      const { error } = await supabase
        .from('characters')
        .update({ [fieldName]: result.data[fieldName] })
        .eq('id', characterId);
      if (!error) return fieldIdle(fieldName);
      console.error('Error saving character:', error);
      fieldError(fieldName);
    },
    [supabase, characterId, fieldError, fieldIdle],
  );

  // create debounced save functions for each field
  const debouncedSaves = useMemo(() => {
    const saves = {} as Record<CharacterInputField, ReturnType<typeof debounce>>;
    characterFields.forEach(field => {
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
      if (userType.type === 'anon') return;
      if (userType.type === 'player' && userType.character_id !== characterId) return;
      if (!name || !type) return;
      
      //TODO: if (fieldStatuses[name as CharacterInputField] === 'busy') return;

      // update status and start the debounce timer
      fieldTyping(name);
      debouncedSaves[name](value[name]);
    });

    // cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, debouncedSaves, userType, supabase, characterId, fieldTyping]);
}
