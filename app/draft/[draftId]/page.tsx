import { notFound } from 'next/navigation';
import { getDraftToken } from '@/lib/session';
import { decodeUserType } from '@/lib/keys';
import { createServerSupabase } from '@/lib/supabase/server';
import { DraftPageClient, IdentityProvider } from '@/components/draft';

interface DraftPageProps {
  params: Promise<{ draftId: string }>;
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { draftId } = await params;

  // Get user's token and determine if they're a master
  const token = await getDraftToken(draftId);
  const userType = decodeUserType(token);

  // Create server Supabase client and fetch draft
  const supabase = await createServerSupabase(draftId);
  const { data: draft, error: draftError } = await supabase
    .from('drafts')
    .select('*')
    .eq('id', draftId)
    .single();

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
    <IdentityProvider userType={userType} token={token ?? undefined}>
      <DraftPageClient
        initialDraft={draft}
        characters={characters}
      />
    </IdentityProvider>
  );
}