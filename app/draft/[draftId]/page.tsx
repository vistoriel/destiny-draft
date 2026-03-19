import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { DraftForm } from '@/components/draft/DraftForm';

interface DraftPageProps {
  params: Promise<{ draftId: string }>;
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { draftId } = await params;

  // Create server Supabase client and fetch draft
  const supabase = await createServerSupabase(draftId);
  const { data: draft, error: draftError } = await supabase.from('drafts').select('*').eq('id', draftId).single();

  const { data: characters, error: charactersError } = await supabase
    .from('characters')
    .select('*')
    .eq('draft_id', draftId)
    .order('sort_order', { ascending: true });

  // Handle not found
  if (draftError || charactersError || !draft || !characters) {
    notFound();
  }

  return (
    <>
      <DraftForm initialDraft={draft} initialCharacters={characters} />
    </>
  );
}
