'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDraftSchema, CreateDraftInput } from '@/lib/schemas';
import { createDraft } from '@/app/actions/create-draft';
import { DraftPlayers } from './DraftPlayers';
import { DraftHeader } from './DraftHeader';
import { RaisedButton } from '../ui';

export function CreateDraftForm() {
  const form = useForm<CreateDraftInput>({
    resolver: zodResolver(CreateDraftSchema),
    defaultValues: {
      draft: {
        title: undefined,
        master_name: undefined,
        description: undefined,
        world: undefined,
        basic_cards: 3,
        basic_experience: 50,
      },
      characters: [
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
        { name: undefined, player_name: undefined },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'characters',
  });

  const onSubmit = async (data: CreateDraftInput) => {
    await createDraft(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DraftHeader className="px-12" register={form.register} fieldPrefix="draft" isMaster />
      <DraftPlayers className="px-12 pt-6" register={form.register} fieldArray={fieldArray} />
      <footer className="flex justify-center items-center gap-1 px-12 pt-8">
        <div className="flex items-center">
          <hr className="h-3 border border-stone-900 rounded-xs" />
        </div>
        <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
        <RaisedButton className="shrink-0" type="submit">
          Create a Draft
        </RaisedButton>
        <hr className="w-full border border-dashed border-stone-900 rounded-xs" />
        <div className="flex items-center">
          <hr className="h-3 border border-stone-900 rounded-xs" />
        </div>
      </footer>
    </form>
  );
}
