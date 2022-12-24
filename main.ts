import { compress, cors, etag, logger } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { serve } from "http/server.ts";

import { getTweetById, getVideo } from "./mod.ts";

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

api.use("/video/*", cors());
// Named path parameters
api.get("/video/:username/:id", async (c) => {
  const username = c.req.param("id");
  const id = c.req.param("id");

  const url = `https://vxtwitter.com/${username}/status/${id}`;

  return c.json(await getVideo(url));
});

app.route("/api", api);

serve(app.fetch);

function wretch(url: string, arg1: { headers: { "User-Agent": string } }) {
  throw new Error("Function not implemented.");
}
