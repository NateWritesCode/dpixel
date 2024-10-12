import { Hono } from "hono";
import { cors } from "hono/cors";
import { validator } from "hono/validator";
import { ZCollect } from "./types/types";

type Bindings = {
   DB_DPIXEL: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
   cors({
      allowMethods: ["POST"],
      credentials: true,
      origin: ["http://127.0.0.1:3000"],
   }),
);


app.post(
   "/collect",
   validator("json", (value, c) => {
      const parsed = ZCollect.safeParse(value);

      if (parsed.success === false) {
         console.error(parsed.error.format());
         return c.text("Invalid request body", 401);
      }

      return parsed.data;
   }),
   async (c) => {
      const { action, browserType, fbcCookie, timestamp, url } =
         c.req.valid("json");

      try {
         await c.env.DB_DPIXEL.prepare(
            /*sql*/ `
               INSERT INTO events (action, browserType, fbcCookie, timestamp, url)
               VALUES (?, ?, ?, ?, ?)
            `,
         )
            .bind(action, browserType, fbcCookie, timestamp, url)
            .run();
      } catch (error) {
         console.error(error);
         return c.text("Internal Server Erro", 500);
      }

      return c.text("OK", 200);
   },
);

export default app;
