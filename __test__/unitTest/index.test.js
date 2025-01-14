import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';

describe('Root Endpoint Tests', () => {
  let app;

  beforeEach(() => {
    app = new Hono();
    
    app.get('/', (c) => {
      c.header('x-powered-by', 'Hono');
      return c.text('hello from hono js with cloudflare workers/wrangler');
    });
    });

  it('Should return 200 response - / with a Powered By header', async () => {
    const res = await app.request('/', {
      method: 'GET',
    });
    
    // Test status code
    expect(res.status).toBe(200);
    
    // Test response body
    expect(await res.text()).toBe('hello from hono js with cloudflare workers/wrangler');
    
    // Test header
    expect(res.headers.get('x-powered-by')).toBe('Hono');
  });
});