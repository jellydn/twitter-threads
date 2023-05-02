import {
  compress,
  cors,
  etag,
  logger,
  serveStatic,
  validator,
} from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { serve } from "http/server.ts";

import { getThreadById, getTweetById, getVideo } from "./mod.ts";

export const app = new Hono();

// KV Database, refer https://deno.com/manual@v1.33.1/runtime/kv
// @ts-expect-error ⚠️ Because Deno KV is currently experimental and subject to change, it is only available when running with --unstable flag in Deno CLI.
const kvDb = await Deno.openKv();

// Builtin middleware
app.use("*", etag(), logger(), compress());
app.use("/static/*", serveStatic({ root: "./" }));

// Routing
app.get("/", (c) =>
  c.html(
    "<h1><a href='https://threadify.productsway.com'>Twitter Threads App</a> helps you read and share Twitter threads easily!</h1>",
  ));
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
api.get(
  "/thread/:id",
  validator((v) => ({
    limit: v.query("limit").isNumeric().message("limit must be numeric!!!"),
  })),
  async (c) => {
    const id = c.req.param("id");
    const limit = c.req.query("limit");

    const response = await getThreadById(id, Number(limit));

    // Increment the view count for the thread
    const viewCount = await kvDb.get(`thread:${id}:views`) ?? 0;
    await kvDb.set(`thread:${id}:views`, viewCount + 1);

    return c.json(response);
  },
);

api.get("/top-threads", async (c) => {
  // Retrieve the view counts for all threads
  const keys = await kvDb.keys("thread:*:views");
  const viewCounts = await Promise.all(
    keys.map((key: string) => kvDb.get(key)),
  );

  // Sort the threads by view count in descending order and take the top 10
  const threads = keys
    .map((key: string, i: string | number) => ({
      id: key.split(":")[1],
      views: viewCounts[i],
    }))
    .sort((a: { views: number }, b: { views: number }) => b.views - a.views)
    .slice(0, 10);

  // Retrieve the thread details for the top 10 threads
  const topThreads = await Promise.all(
    threads.map(async (thread: { id: string; views: number }) => {
      const t = await getThreadById(thread.id);
      return { ...t, views: thread.views };
    }),
  );

  return c.json(topThreads);
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
