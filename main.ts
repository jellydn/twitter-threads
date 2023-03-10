import { compress, cors, etag, logger, serveStatic, validator } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { serve } from "http/server.ts";

import { getThreadById, getTweetById, getVideo } from "./mod.ts";

export const app = new Hono();

// Builtin middleware
app.use("*", etag(), logger(), compress());
app.use("/static/*", serveStatic({ root: "./" }));

// Routing
app.get("/", (c) =>
  c.html(
    "<h1><a href='https://threadify.productsway.com'>Twitter Threads App</a> helps you read and share Twitter threads easily!</h1>"
  )
);
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

// Nested route
const api = new Hono();
api.use("/tweet/*", cors());
// Named path parameters
api.get("/tweet/:id", async (c) => {
  const id = c.req.param("id");

  const response = await getTweetById(id);

  return c.json(response);
});

api.use("/thread/*", cors());
// Named path parameters
api.get("/thread/:id", validator((v) => ({
    limit: v.query('limit').isNumeric().message('limit must be numeric!!!'),
  })), async (c) => {
  const id = c.req.param("id");
  const limit = c.req.query("limit");

  const response = await getThreadById(id, Number(limit));

  return c.json(response);
});

api.use("/video/*", cors());
// Named path parameters
api.get("/video/:id", async (c) => {
  const username = "itman";
  const id = c.req.param("id");

  const url = `https://vxtwitter.com/${username}/status/${id}`;

  const response = await getVideo(url);

  return c.json(response);
});

app.route("/api", api);

serve(app.fetch);
