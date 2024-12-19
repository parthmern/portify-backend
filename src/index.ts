import { Hono } from 'hono'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

app.get('/', (c) => {
  const DATABASE_URL = c.env.DATABASE_URL || "";
  console.log(DATABASE_URL);
  return c.text('hello from hono js with cloudflare workers/wrangler');

})

export default app