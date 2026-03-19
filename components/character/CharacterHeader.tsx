'use client';

import Image from 'next/image';
import { LabeledInput } from '../ui';
import { DamageTrack } from './DamageTrack';
import { ShockTrack } from './ShockTrack';
import { cn } from '@/lib/utils';
import { CharacterSchema } from '@/lib/schemas';
import { CharacterRow } from '@/lib/supabase';
import { useIdentityContext } from '../draft';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCharacterAutosave, useCharacterPresence, useRealtime } from '@/hooks';

export type CharacterHeaderProps = {
  className?: string;
  initialCharacter: CharacterRow;
};

export function CharacterHeader({ className, initialCharacter }: CharacterHeaderProps) {
  const { userType } = useIdentityContext();
  const canEdit =
    userType.type === 'master' || (userType.type === 'player' && userType.character_id === initialCharacter.id);

  const form = useForm({
    resolver: zodResolver(CharacterSchema),
    defaultValues: CharacterSchema.parse(initialCharacter),
  });

  const { fieldStatuses, callbacks } = useCharacterPresence(initialCharacter.id);
  useCharacterAutosave(initialCharacter.id, form.watch, callbacks);
  useRealtime(initialCharacter.id, form.reset, CharacterSchema, 'characters');

  return (
    <header className={cn('flex flex-col gap-4', className)}>
      <div className="flex gap-4">
        <Image
          className="border-2 border-stone-900 w-54.5 h-54.5 object-cover rounded-xs"
          src="/character-image.png"
          width={428}
          height={428}
          alt="Character Image"
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <LabeledInput
              variant="title"
              label="character's name"
              placeholder="Unknown Character"
              defaultValue={initialCharacter.name || ''}
              disabled={!canEdit}
              status={fieldStatuses?.name || 'idle'}
              {...form.register('name')}
            />
            <LabeledInput
              label="player's name"
              className="w-26"
              placeholder="Player"
              defaultValue={initialCharacter.player_name || ''}
              disabled={!canEdit}
              status={fieldStatuses?.player_name || 'idle'}
              {...form.register('player_name')}
            />
          </div>
          <DamageTrack />
          <ShockTrack />
        </div>
      </div>
      <div className="flex items-end gap-4">
        <LabeledInput
          label="role"
          className="w-54.5"
          containerClassName="mr-auto"
          placeholder="Mystic"
          defaultValue={initialCharacter.role || ''}
          disabled={!canEdit}
          status={fieldStatuses?.role || 'idle'}
          {...form.register('role')}
        />
        <LabeledInput
          label="sign"
          placeholder="Gemini"
          defaultValue={initialCharacter.sign || ''}
          disabled={!canEdit}
          status={fieldStatuses?.sign || 'idle'}
          {...form.register('sign')}
        />
        <LabeledInput
          label="cards"
          placeholder="3"
          defaultValue={initialCharacter.extra_cards || 0}
          disabled={!canEdit}
          status={fieldStatuses?.extra_cards || 'idle'}
          {...form.register('extra_cards')}
        />
        <LabeledInput
          label="experience"
          defaultValue={initialCharacter.extra_experience || 0}
          disabled={!canEdit}
          status={fieldStatuses?.extra_experience || 'idle'}
          {...form.register('extra_experience')}
        />
      </div>
    </header>
  );
}
