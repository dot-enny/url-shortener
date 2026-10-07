import crypto from 'node:crypto';

// Generates a 6-character random hex string (e.g. 'e4a2bf')
export function generateShortCode(): string {
  return crypto.randomBytes(3).toString('hex');
}