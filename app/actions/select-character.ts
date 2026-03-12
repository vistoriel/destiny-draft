'use server';

import { generateKeyAndHash, signPlayerToken } from "@/lib/keys";
import { getDraftToken, saveDraftToken } from "@/lib/session";
import { createServiceSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export type SelectCharacterProps = {
  characterId: string;
}

export type SelectCharacterResult = 'already_claimed' | 'invalid_character' | 'already_has_token' | 'error';

export async function selectCharacter({ characterId }: SelectCharacterProps): Promise<SelectCharacterResult> {
  const supabase = createServiceSupabase();
  const { data: character, error } = await supabase
    .from('characters')
    .select()
    .eq('id', characterId)
    .single();
  if (error || !character) return 'invalid_character'; // Character not found
  if (character.is_claimed) return 'already_claimed'; // Character already claimed by someone else

  const existingToken = await getDraftToken(character.draft_id);
  if (existingToken) return 'already_has_token'; // User already has a token, prevent selecting another character

  // Generate player key and hash
  const [playerKey, playerKeyHash] = generateKeyAndHash('player');

  const { data: _, error: updateError } = await supabase
    .from('characters')
    .update({ is_claimed: true, player_key_hash: playerKeyHash })
    .eq('id', characterId);
  if (updateError) return 'error'; // Failed to claim character

  // Sign and save draft token in the cookies
  const token = await signPlayerToken(character.draft_id, characterId, playerKeyHash);
  await saveDraftToken(character.draft_id, token);

  // Redirect to the character page with player key in URL
  redirect(`/draft/${character.draft_id}/${characterId}?player_key=${playerKey}`);
}