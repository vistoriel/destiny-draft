import { notFound } from 'next/navigation';
import { getDraftToken } from '@/lib/session';
import { decodeTokenPayload } from '@/lib/keys';
import { createServerSupabase } from '@/lib/supabase/server';
import { DraftPageClient } from '@/components/draft';

interface DraftPageProps {
  params: Promise<{ draftId: string }>;
}

export default async function DraftPage({ params }: DraftPageProps) {
  const { draftId } = await params;

  // Get user's token and determine if they're a master
  const token = await getDraftToken(draftId);
  const payload = token ? decodeTokenPayload(token) : null;
  const isMaster = payload?.user_type === 'master';

  // Create server Supabase client and fetch draft
  const supabase = await createServerSupabase(draftId);
  const { data: draft, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('id', draftId)
    .single();

  // Handle not found
  if (error || !draft) {
    notFound();
  }

  return (
    <DraftPageClient
      initialDraft={draft}
      isMaster={isMaster}
      token={token ?? undefined}
    />
  );
}