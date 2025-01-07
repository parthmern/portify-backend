import { Hono } from 'hono'
import { userRouter } from './routes/userRoute';
import { env } from 'hono/adapter'
import { profileRouter } from './routes/profileRoute';
import { cors } from "hono/cors";
import { skillsRouter } from './routes/skillsRoute';
import { workRoute } from './routes/workRoute';
import { educationRoute } from './routes/educationRoute';
import { projectRoute } from './routes/projectRoute';
import { contactRoute } from './routes/contactRoute';


// import "dotenv/config";
// import dotenv from 'dotenv';
// dotenv.config();



// const app = new Hono<{
//   Bindings: {
//     DATABASE_URL: string
//   }
// }>()
const app = new Hono();

app.use("*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/", profileRouter);
app.route("/api/v1/skills", skillsRouter);
app.route("/api/v1/works", workRoute);
app.route("/api/v1/education", educationRoute);
app.route("/api/v1/projects", projectRoute);
app.route("/api/v1/contacts", contactRoute);

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