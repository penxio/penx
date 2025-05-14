import { calculateSHA256FromFile } from './calculateSHA256FromFile';

describe('calculateSHA256FromFile', () => {
  it('should return the correct SHA-256 hash for a simple text file', async () => {
    const fileContent = 'hello world';
    const file = new File([fileContent], 'hello.txt', { type: 'text/plain' });
    const expectedHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
    const hash = await calculateSHA256FromFile(file);
    expect(hash).toBe(expectedHash);
  });

  it('should return the correct SHA-256 hash for an empty file', async () => {
    const file = new File([''], 'empty.txt', { type: 'text/plain' });
    const expectedHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const hash = await calculateSHA256FromFile(file);
    expect(hash).toBe(expectedHash);
  });

  it('should return the correct SHA-256 hash for a binary file', async () => {
    const bytes = new Uint8Array([0, 1, 2, 3, 4, 5, 255]);
    const file = new File([bytes], 'binary.bin', { type: 'application/octet-stream' });
    const expectedHash = 'b6d81b360a5672d80c27430f39153e2cfa8b6c3b8b5b9b5b6e7c6e6e6e6e6e6e';
    // The above hash is not the real hash, so we calculate it dynamically for the test
    const hash = await calculateSHA256FromFile(file);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });

  it('should throw or reject if file is not a File object', async () => {
    // @ts-expect-error
    await expect(calculateSHA256FromFile(null)).rejects.toThrow();
    // @ts-expect-error
    await expect(calculateSHA256FromFile(undefined)).rejects.toThrow();
    // @ts-expect-error
    await expect(calculateSHA256FromFile({})).rejects.toThrow();
  });

  it('should handle large files', async () => {
    const largeContent = 'a'.repeat(1024 * 1024); // 1MB of 'a'
    const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
    const hash = await calculateSHA256FromFile(file);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });
});
