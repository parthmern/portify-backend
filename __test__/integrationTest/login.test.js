import { describe, it, expect } from 'vitest';

describe('Simple Boolean Test', () => {
  it('should verify that true equals true', () => {
    expect(true).toBe(true);
  });
});

// need to reveal local ip to make accelerate connection 
// https://stackoverflow.com/questions/74962019/prisma-connect-with-local-database-on-serverless-project-cloudflare-workers