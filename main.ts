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
import { logger as consolaLogger } from "./logger.ts";

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

/**
 * Tracking thread
 * Increment the view count for the thread
 *
 * @param {string} id
 */
async function trackingThread(id: string, info?: {
  username: string;
  avatar: string;
  title: string;
}) {
  consolaLogger.info(`Tracking thread ${id}`);
  const viewCount = await kvDb.get(["threads", id]);
  consolaLogger.info(`Thread ${id} has ${JSON.stringify(viewCount)} views`);
  await kvDb.set(["threads", id], (viewCount?.value ?? 0) + 1);
}

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
    trackingThread(id).catch(consolaLogger.error);

    return c.json(response);
  },
);

api.get("/top-threads", async (c) => {
  const topThreads = [];
  // Get all the keys in the KV database that start with "threads"
  for await (const entry of kvDb.list({ prefix: ["threads"] })) {
    topThreads.push({
      id: entry.key[1],
      viewCount: entry.value,
      avatar: "",
      username: "",
    });
  }

  // Get top 10 and sort by viewCount
  const threads = topThreads.sort((a, b) => b.viewCount - a.viewCount).slice(
    0,
    10,
  );

  // Get top threads with the detail
  for (const thread of threads) {
    const response = await getTweetById(thread.id);
    thread.avatar = response.includes?.users[0]?.profile_image_url;
    thread.username = response.includes?.users[0]?.username;
  }

  return c.json(threads);
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
