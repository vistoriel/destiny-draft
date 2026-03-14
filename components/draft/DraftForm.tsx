'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { DraftHeader } from './DraftHeader';
import { useDraftRealtime } from '@/lib/hooks';
import { useIdentityContext } from './IdentityContext';
import { DraftRow } from '@/lib/supabase';
import { DraftSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDraftAutosave } from '@/lib/hooks/useDraftAutosave';

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

  // Set up autosave for masters
  const { fieldStatuses } = useDraftAutosave(initialDraft.id, form.watch);

  // Subscribe to realtime updates
  useDraftRealtime(initialDraft.id, form.reset);

  return (
    <DraftHeader
      className="px-12 pb-6 border-b border-stone-200"
      register={form.register}
      saveStatuses={fieldStatuses}
      initialDraft={initialDraft}
      isMaster={userType.type === 'master'}
    />
  );
}
