import wretch from "wretch";

import { env } from "./env.ts";
import { logger } from "./logger.ts";
import { TwitterDetail } from "./types.ts";

const twitterApi = wretch("https://api.twitter.com/2/")
  .auth(`Bearer ${env.JWT_TOKEN}`)
  .options({ credentials: "include", mode: "cors" });

export const getVideo = async (url: string) => {
  const text = await wretch(url, {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
    },
  }).get().text();

  const metaTagRegex = /<meta\s+[^>]+>/gi;
  const attributeRegex = /([^\s]+)="([^"]+)"/gi;

  const metaTags = text.match(metaTagRegex);
  const meta: Record<string, string> = {};
  if (metaTags) {
    for (const metaTag of metaTags) {
      const obj: { [key: string]: string } = {};
      let match = attributeRegex.exec(metaTag);
      while (match) {
        obj[match[1]] = match[2];
        match = attributeRegex.exec(metaTag);
      }
      if (obj.name ?? obj.property) {
        meta[obj.name ?? obj.property] = obj.content;
      }
    }
  }

  return { meta };
};

export const getTweetById = (id: string): Promise<TwitterDetail> => {
  logger.info("get tweet by id", id);
  const params = new URLSearchParams({
    expansions: "author_id,attachments.media_keys",
    "user.fields": "name,username,profile_image_url",
    "tweet.fields": "attachments,conversation_id,referenced_tweets,created_at",
    "media.fields": "url,alt_text",
  });

  return twitterApi.url(`tweets/${id}?${params.toString()}`).get().json();
};

export const getThreadById = async (threadId: string, maxDepth = 5) => {
  logger.info("get tweet thread by", threadId);
  const ids: string[] = [threadId];
  const thread: Record<string, TwitterDetail> = {};

  let tweet = await getTweetById(threadId);
  thread[threadId] = tweet;

  const isThread = tweet.data.id !== tweet.data.conversation_id;

  if (isThread) {
    for (let i = 0; i < maxDepth; i += 1) {
      const parentTweet = tweet.data?.referenced_tweets?.find((item) =>
        item.type === "replied_to"
      )?.id;
      if (parentTweet) {
        ids.push(parentTweet);
        tweet = await getTweetById(parentTweet);
        thread[parentTweet] = tweet;
      }
    }
  }

  return {
    ids,
    thread,
  };
};
