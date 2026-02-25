'use client';

import { useState, useCallback } from 'react';
import { DraftHeader } from './DraftHeader';
import { DraftCharacters } from './DraftCharacters';
import { createClientSupabase } from '@/lib/supabase/client';
import { useAutosaveField, type SaveStatus } from '@/lib/hooks/useAutosaveField';
import { useDraftRealtime } from '@/lib/hooks/useDraftRealtime';
import type { Database } from '@/lib/supabase/database.types';

interface DraftPageClientProps {
  initialDraft: {
    id: string;
    title: string;
    master_name: string;
    description: string | null;
    world: string | null;
    basic_cards: number;
    basic_experience: number;
  };
  isMaster: boolean;
  token?: string;
}

type DraftField = 'title' | 'master_name' | 'description' | 'world' | 'basic_cards' | 'basic_experience';

export function DraftPageClient({ initialDraft, isMaster, token }: DraftPageClientProps) {
  // Create Supabase client
  const client = createClientSupabase(token);

  // Use local state for display values (both masters and players)
  const [title, setTitle] = useState(initialDraft.title);
  const [masterName, setMasterName] = useState(initialDraft.master_name);
  const [description, setDescription] = useState(initialDraft.description ?? '');
  const [world, setWorld] = useState(initialDraft.world ?? '');
  const [basicCards, setBasicCards] = useState(initialDraft.basic_cards);
  const [basicExperience, setBasicExperience] = useState(initialDraft.basic_experience);

  // For masters: use useAutosaveField for autosave functionality only
  const titleField = useAutosaveField(client, initialDraft.id, 'title', initialDraft.title);
  const masterNameField = useAutosaveField(client, initialDraft.id, 'master_name', initialDraft.master_name);
  const descriptionField = useAutosaveField(client, initialDraft.id, 'description', initialDraft.description ?? '');
  const worldField = useAutosaveField(client, initialDraft.id, 'world', initialDraft.world ?? '');
  const basicCardsField = useAutosaveField(client, initialDraft.id, 'basic_cards', initialDraft.basic_cards);
  const basicExperienceField = useAutosaveField(client, initialDraft.id, 'basic_experience', initialDraft.basic_experience);

  // Handle realtime updates from other users
  const handleRealtimeUpdate = useCallback((draft: Database['public']['Tables']['drafts']['Row']) => {
    setTitle(draft.title);
    setMasterName(draft.master_name);
    setDescription(draft.description ?? '');
    setWorld(draft.world ?? '');
    setBasicCards(draft.basic_cards);
    setBasicExperience(draft.basic_experience);
  }, []);

  // Subscribe to realtime updates
  useDraftRealtime(client, initialDraft.id, handleRealtimeUpdate);

  // Current values for display (from local state)
  const currentValues = {
    title,
    master_name: masterName,
    description,
    world,
    basic_cards: basicCards,
    basic_experience: basicExperience,
  };

  // Save statuses (only for masters)
  const saveStatuses: Record<string, SaveStatus> = isMaster
    ? {
        title: titleField.saveStatus,
        master_name: masterNameField.saveStatus,
        description: descriptionField.saveStatus,
        world: worldField.saveStatus,
        basic_cards: basicCardsField.saveStatus,
        basic_experience: basicExperienceField.saveStatus,
      }
    : {
        title: 'idle',
        master_name: 'idle',
        description: 'idle',
        world: 'idle',
        basic_cards: 'idle',
        basic_experience: 'idle',
      };

  // Handle field changes
  const handleFieldChange = useCallback((fieldName: string, value: string | number) => {
    if (!isMaster) return;

    // Update local state immediately (optimistic)
    switch (fieldName as DraftField) {
      case 'title':
        setTitle(value as string);
        titleField.setValue(value as string);
        break;
      case 'master_name':
        setMasterName(value as string);
        masterNameField.setValue(value as string);
        break;
      case 'description':
        setDescription(value as string);
        descriptionField.setValue(value as string);
        break;
      case 'world':
        setWorld(value as string);
        worldField.setValue(value as string);
        break;
      case 'basic_cards':
        setBasicCards(value as number);
        basicCardsField.setValue(value as number);
        break;
      case 'basic_experience':
        setBasicExperience(value as number);
        basicExperienceField.setValue(value as number);
        break;
    }
  }, [isMaster, titleField, masterNameField, descriptionField, worldField, basicCardsField, basicExperienceField]);

  return (
    <>
      <DraftHeader
        className="px-12 pb-6 border-b border-stone-200"
        mode="update"
        draft={currentValues}
        isMaster={isMaster}
        saveStatuses={saveStatuses}
        onFieldChange={handleFieldChange}
      />
      <DraftCharacters className="px-12 pt-6" />
    </>
  );
}
