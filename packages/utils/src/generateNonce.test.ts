import { generateNonce } from './generateNonce';

describe('generateNonce', () => {
  it('should generate a string of default length 16', () => {
    const nonce = generateNonce();
    expect(typeof nonce).toBe('string');
    expect(nonce).toHaveLength(16);
  });

  it('should generate a string of specified length', () => {
    const nonce = generateNonce(32);
    expect(typeof nonce).toBe('string');
    expect(nonce).toHaveLength(32);
  });

  it('should generate different nonces on subsequent calls', () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    expect(nonce1).not.toBe(nonce2);
  });

  it('should generate a string with only allowed characters', () => {
    const allowed = /^[A-Za-z0-9]+$/;
    const nonce = generateNonce(64);
    expect(allowed.test(nonce)).toBe(true);
  });

  it('should return an empty string if length is 0', () => {
    const nonce = generateNonce(0);
    expect(nonce).toBe('');
  });

  it('should throw or handle negative length gracefully', () => {
    expect(() => generateNonce(-5)).not.toThrow();
    expect(generateNonce(-5)).toBe('');
  });

  it('should generate a string of length 1', () => {
    const nonce = generateNonce(1);
    expect(nonce).toHaveLength(1);
  });

  it('should generate a string of large length', () => {
    const nonce = generateNonce(256);
    expect(nonce).toHaveLength(256);
  });

  it('should not return the same nonce for the same length in most cases', () => {
    // Not a strict guarantee, but highly unlikely
    const nonces = new Set<string>();
    for (let i = 0; i < 100; i++) {
      nonces.add(generateNonce(16));
    }
    expect(nonces.size).toBeGreaterThan(90);
  });
});
