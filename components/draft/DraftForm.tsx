'use client';

import { useForm } from 'react-hook-form';
import { DraftHeader } from './DraftHeader';
import { useIdentityContext } from './IdentityContext';
import { CharacterRow, DraftRow } from '@/lib/supabase';
import { DraftSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { DraftCharacters } from './DraftCharacters';
import { DraftCharacterSelector } from './DraftCharacterSelector';
import { useDraftAutosave, useDraftPresence, useRealtime } from '@/hooks';

type DraftFormProps = {
  initialDraft: DraftRow;
  initialCharacters: CharacterRow[];
};

export function DraftForm({ initialDraft, initialCharacters }: DraftFormProps) {
  const { userType } = useIdentityContext();

  // Initialize form with initial draft values
  const form = useForm({
    resolver: zodResolver(DraftSchema),
    defaultValues: DraftSchema.parse(initialDraft),
  });

  const { fieldStatuses, callbacks } = useDraftPresence(initialDraft.id);
  useDraftAutosave(initialDraft.id, form.watch, callbacks);
  //useDraftRealtime(initialDraft.id, form.reset);
  useRealtime(initialDraft.id, form.reset, DraftSchema);

  return (
    <>
      <DraftHeader
        className="px-12 pb-6 border-b border-stone-200"
        register={form.register}
        fieldStatuses={fieldStatuses}
        initialDraft={initialDraft}
        isMaster={userType.type === 'master'}
      />
      { userType.type === 'anon'
        ? <DraftCharacterSelector className="px-12 pt-6" characters={initialCharacters} /> 
        : <DraftCharacters className="px-12 pt-6" characters={initialCharacters} />
      }
    </>
  );
}
