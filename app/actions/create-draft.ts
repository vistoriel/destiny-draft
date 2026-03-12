"use server";

import { CreateDraftProps } from "@/lib/schemas";
import { createServiceSupabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { generateKeyAndHash, signMasterToken } from '@/lib/keys';
import { saveDraftToken } from "@/lib/session";

export async function createDraft({ draft, characters }: CreateDraftProps) {
  // Generate master key and hash
  const [masterKey, masterKeyHash] = generateKeyAndHash('master');

  // Insert new draft to the database
  const supabase = createServiceSupabase();
  const { data: createdDraft, error: draftError } = await supabase
    .from('drafts')
    .insert({ ...draft, master_key_hash: masterKeyHash })
    .select()
    .single();
  if (draftError || !createdDraft) {
    console.error('Draft creation error:', draftError);
    return;
  }

  // Insert characters if provided
  if (characters.length > 0) {
    const charactersToInsert = characters.map((c, i) => ({ ...c, draft_id: createdDraft.id, sort_order: i }));
    const { error: charactersError } = await supabase
      .from('characters')
      .insert(charactersToInsert);
    if (charactersError) {
      // Continue even if characters fail, but log it
      console.error('Character creation error:', charactersError);
    }
  }

  // Sign and save draft token in the cookies
  const token = await signMasterToken(createdDraft.id, masterKeyHash);
  await saveDraftToken(createdDraft.id, token);

  // Redirect to the draft page with master key in URL
  redirect(`/draft/${createdDraft.id}?master_key=${masterKey}`);
}
