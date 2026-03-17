'use client';

import { useForm } from 'react-hook-form';
import { DraftHeader } from './DraftHeader';
import { useIdentityContext } from './IdentityContext';
import { DraftRow } from '@/lib/supabase';
import { DraftSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDraftAutosave, useDraftPresence, useDraftRealtime } from '@/hooks';

type DraftFormProps = {
  initialDraft: DraftRow;
};

export function DraftForm({ initialDraft }: DraftFormProps) {
  const { userType } = useIdentityContext();

  // Initialize form with initial draft values
  const form = useForm({
    resolver: zodResolver(DraftSchema),
    defaultValues: DraftSchema.parse(initialDraft),
  });

  const { fieldStatuses, callbacks } = useDraftPresence(initialDraft.id);
  useDraftAutosave(initialDraft.id, form.watch, callbacks);
  useDraftRealtime(initialDraft.id, form.reset);

  return (
    <DraftHeader
      className="px-12 pb-6 border-b border-stone-200"
      register={form.register}
      fieldStatuses={fieldStatuses}
      initialDraft={initialDraft}
      isMaster={userType.type === 'master'}
    />
  );
}
