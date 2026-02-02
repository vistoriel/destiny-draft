import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

export async function signToken(
  draftId: string, 
  role: 'master' | 'player', 
  keyHash: string
): Promise<string> {
  const secret = new TextEncoder().encode(supabaseJwtSecret);
  const jwt = await new SignJWT({ draft_id: draftId, role, key_hash: keyHash })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return jwt;
}

/**
 * Set draft key in cookies
 */
export async function saveDraftKey(draftId: string, role: 'master' | 'player', keyHash: string) {
  const token = await signToken(draftId, role, keyHash);
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
 * Clear draft key from cookies
 */
export async function clearDraftKey(draftId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`draft_${draftId}`);
}