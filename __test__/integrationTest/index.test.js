import { describe, it, expect, beforeEach, vi } from 'vitest';
import app from '../../src/index';

describe('Root Route Integration Test', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock the application environment for the test
    app.fetch = app.fetch.bind({
      env: {
        DATABASE_URL: 'postgresql://postgres:mysecretpassword@localhost:5432/postgres',
      },
    });
  });

  it('should return a response with a text message and mock the DATABASE_URL', async () => {
    const mockContext = {
      env: {
        DATABASE_URL: 'postgresql://postgres:mysecretpassword@localhost:5432/postgres',
      },
    };

    const res = await app.request('/', {
      method: 'GET',
    }, mockContext);

    // Validate the response status
    expect(res.status).toBe(200);

    // Validate the response text
    const responseText = await res.text();
    expect(responseText).toBe('hello from hono js with cloudflare workers/wrangler');

    // Validate the mocked DATABASE_URL
    console.log = vi.fn(); // Mock console.log to capture the output
    
  });
});
