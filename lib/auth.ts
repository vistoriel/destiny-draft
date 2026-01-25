import { createAdminClient } from './supabase/server';
import { verifyKey } from './keys';

/**
 * Validate an admin key for a specific game
 */
export async function validateAdminKey(gameId: string, adminKey: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('games')
      .select('admin_key_hash')
      .eq('id', gameId)
      .single<{ admin_key_hash: string }>();

    if (error || !data) {
      return false;
    }

    return verifyKey(adminKey, data.admin_key_hash);
  } catch (error) {
    console.error('Error validating admin key:', error);
    return false;
  }
}

/**
 * Validate a player key for a specific character
 */
export async function validatePlayerKey(characterId: string, playerKey: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('characters')
      .select('player_key_hash')
      .eq('id', characterId)
      .single<{ player_key_hash: string | null }>();

    if (error || !data || !data.player_key_hash) {
      return false;
    }

    return verifyKey(playerKey, data.player_key_hash);
  } catch (error) {
    console.error('Error validating player key:', error);
    return false;
  }
}

/**
 * Get game ID from character ID
 */
export async function getGameIdFromCharacter(characterId: string): Promise<string | null> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('characters')
      .select('game_id')
      .eq('id', characterId)
      .single<{ game_id: string }>();

    if (error || !data) {
      return null;
    }

    return data.game_id;
  } catch (error) {
    console.error('Error getting game ID:', error);
    return null;
  }
}
