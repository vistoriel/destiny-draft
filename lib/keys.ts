import crypto from 'crypto';

const secret = process.env.KEY_ENCRYPTION_SECRET;

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
  if (!secret) throw new Error('KEY_ENCRYPTION_SECRET is not defined');
  return crypto.createHmac('sha256', secret).update(key).digest('hex');
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
