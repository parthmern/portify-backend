import { Hono } from 'hono'
import { userRouter } from './routes/userRoute';
import { env } from 'hono/adapter'

// import "dotenv/config";
// import dotenv from 'dotenv';
// dotenv.config();



// const app = new Hono<{
//   Bindings: {
//     DATABASE_URL: string
//   }
// }>()
const app = new Hono();

app.route("/api/v1/user", userRouter);

app.get('/', (c) => {
  console.log("cev", c.env);
  // @ts-ignore
  //const DATABASE_URL = c.env.DATABASE_URL || "";
  const DATABASE_URL  = env<{ DATABASE_URL: string }>(c)

  // @ts-ignore
  console.log("dburl=>", DATABASE_URL);
  return c.text('hello from hono js with cloudflare workers/wrangler');
})


export default app