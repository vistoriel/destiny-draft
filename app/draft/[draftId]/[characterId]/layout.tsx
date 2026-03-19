import { CharacterHeader } from '@/components/character';
import { CharacterNav } from '@/components/character/CharacterNav';
import { createServerSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export type CharacterLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    draftId: string;
    characterId: string;
  }>;
}>;

export default async function CharacterLayout({ children, params }: CharacterLayoutProps) {
  const { draftId, characterId } = await params;

  const supabase = await createServerSupabase(draftId);

  const { data: character, error: characterError } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  // Handle not found
  if (characterError || !character) {
    notFound();
  }

  return (
    <>
      <CharacterHeader className="px-12 pb-6 border-b border-stone-200" initialCharacter={character} />
      <aside className="relative">
        <CharacterNav draftId={draftId} characterId={characterId} />
      </aside>
      {children}
    </>
  );
}
