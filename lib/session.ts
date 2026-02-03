import { cookies } from 'next/headers';

/**
 * Set draft token in cookies
 */
export async function saveDraftToken(draftId: string, token: string) {
  const cookieStore = await cookies();
  cookieStore.set(`draft_${draftId}`, encodeURIComponent(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Get draft token from cookies
 */
export async function getDraftToken(draftId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(`draft_${draftId}`);
  return token ? decodeURIComponent(token.value) : null;
}

/**
 * Clear draft token from cookies
 */
export async function clearDraftToken(draftId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`draft_${draftId}`);
}
