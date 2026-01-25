import { cookies } from 'next/headers';

const ADMIN_KEY_COOKIE = 'admin_key';
const PLAYER_KEY_COOKIE = 'player_key';

/**
 * Set admin key in cookie
 */
export async function setAdminKey(gameId: string, adminKey: string) {
  const cookieStore = await cookies();
  cookieStore.set(`${ADMIN_KEY_COOKIE}_${gameId}`, adminKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Get admin key from cookie
 */
export async function getAdminKey(gameId: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(`${ADMIN_KEY_COOKIE}_${gameId}`);
  return cookie?.value || null;
}

/**
 * Set player key in cookie
 */
export async function setPlayerKey(characterId: string, playerKey: string) {
  const cookieStore = await cookies();
  cookieStore.set(`${PLAYER_KEY_COOKIE}_${characterId}`, playerKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Get player key from cookie
 */
export async function getPlayerKey(characterId: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(`${PLAYER_KEY_COOKIE}_${characterId}`);
  return cookie?.value || null;
}

/**
 * Clear admin key from cookie
 */
export async function clearAdminKey(gameId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`${ADMIN_KEY_COOKIE}_${gameId}`);
}

/**
 * Clear player key from cookie
 */
export async function clearPlayerKey(characterId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`${PLAYER_KEY_COOKIE}_${characterId}`);
}
