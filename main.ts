import { compress, cors, etag, logger } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { serve } from "http/server.ts";

import { getTweetById } from "./mod.ts";

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
api.get("/thread/:id", async (c) => {
  const id = c.req.param("id");

  const response = await getTweetById(id);

  return c.json(response);
});

app.route("/api", api);

serve(app.fetch);
