import crypto, { createSecretKey } from 'crypto';
import { SignJWT } from 'jose';

export type BaseTokenPayload = {
  draft_id: string;
  key_hash: string;
  role: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
};

export type MasterTokenPayload = {
  user_type: 'master';
} & BaseTokenPayload;

export type PlayerTokenPayload = {
  user_type: 'player';
  character_id: string;
} & BaseTokenPayload;

export type DraftTokenPayload = MasterTokenPayload | PlayerTokenPayload;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
const keySecret = process.env.KEY_ENCRYPTION_SECRET;

/**
 * Generate a secure random key with a prefix
 */
export function generateKey(prefix: 'master' | 'player'): string {
  const randomBytes = crypto.randomBytes(32);
  const randomString = randomBytes.toString('base64url').slice(0, 32);
  return `${prefix}_${randomString}`;
}

/**
 * Hash a key for secure storage in database
 */
export function hashKey(key: string): string {
  if (!keySecret) throw new Error('KEY_ENCRYPTION_SECRET is not defined');
  return crypto.createHmac('sha256', keySecret).update(key).digest('hex');
}

/**
 * Verify a key against a stored hash
 */
export function verifyKey(key: string, hash: string): boolean {
  const keyHash = hashKey(key);
  return crypto.timingSafeEqual(
    Buffer.from(keyHash),
    Buffer.from(hash)
  );
}

/**
 * Generate a master key and hash for game creation
 */
export function generateKeyAndHash(prefix: 'master' | 'player'): [string, string] {
  const key = generateKey(prefix);
  const hash = hashKey(key);
  return [key, hash];
}

export async function signMasterToken(
  draftId: string,  
  keyHash: string
): Promise<string> {
  if (!supabaseJwtSecret) throw new Error('SUPABASE_JWT_SECRET is not defined');
  if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined');
  const secret = createSecretKey(supabaseJwtSecret, 'base64url');
  const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  const jwt = await new SignJWT({ 
    draft_id: draftId, 
    key_hash: keyHash,
    user_type: 'master',
    role: 'authenticated',
    aud: 'authenticated'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(`https://${projectId}.supabase.co/auth/v1`)
    .setAudience('authenticated')
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return jwt;
}

export async function signPlayerToken(
  draftId: string, 
  characterId: string,
  keyHash: string
): Promise<string> {
  if (!supabaseJwtSecret) throw new Error('SUPABASE_JWT_SECRET is not defined');
  if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined');
  const secret = createSecretKey(supabaseJwtSecret, 'base64url');
  const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  const jwt = await new SignJWT({ 
    draft_id: draftId, 
    character_id: characterId,
    key_hash: keyHash,
    user_type: 'player',
    role: 'authenticated',
    aud: 'authenticated'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(`https://${projectId}.supabase.co/auth/v1`)
    .setAudience('authenticated')
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return jwt;
}

/**
 * Decode JWT payload without verification (for reading user_type)
 * Verification is handled by Supabase
 */
export function decodeTokenPayload(token: string): DraftTokenPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as DraftTokenPayload;
  } catch {
    return null;
  }
}