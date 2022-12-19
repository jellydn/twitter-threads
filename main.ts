import { serve } from "http/server.ts";
import { Hono } from "hono/mod.ts";
import { compress, cors, etag, logger } from "hono/middleware.ts";

import wretch from "wretch";

export const app = new Hono();

// Builtin middleware
app.use("*", etag(), logger(), compress());

// Routing
app.get("/", (c) => c.html("<h1>Hello Hono!</h1>"));
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

// Nested route
const api = new Hono();
api.use("/thread/*", cors());
// Named path parameters
api.get("/thread/:username/:id", async (c) => {
  const username = c.req.param("id");
  const id = c.req.param("id");

  const url = `https://vxtwitter.com/${username}/status/${id}`;

  const text = await wretch(url, {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
    },
  }).get().text();

  return c.text(text);
});

app.route("/api", api);

serve(app.fetch);
