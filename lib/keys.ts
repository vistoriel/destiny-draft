import crypto from 'crypto';

/**
 * Generate a secure random key with a prefix
 */
export function generateKey(prefix: 'admin' | 'player'): string {
  const randomBytes = crypto.randomBytes(32);
  const randomString = randomBytes.toString('base64url').slice(0, 32);
  return `${prefix}-${randomString}`;
}

/**
 * Hash a key for secure storage in database
 */
export function hashKey(key: string): string {
  const secret = process.env.KEY_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('KEY_ENCRYPTION_SECRET is not defined');
  }
  
  return crypto
    .createHmac('sha256', secret)
    .update(key)
    .digest('hex');
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
 * Generate an admin key for game creation
 */
export function generateAdminKey(): string {
  return generateKey('admin');
}

/**
 * Generate a player key for character claiming
 */
export function generatePlayerKey(): string {
  return generateKey('player');
}
