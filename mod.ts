import wretch from "wretch";
import pMemoize from "p-memoize";
import LRUCache from "lru_cache";

import { env } from "./env.ts";
import { logger } from "./logger.ts";
import { TwitterDetail } from "./types.ts";

// create a LRU cache with max size of 100 items
const cache = new LRUCache<string, string>(100);

// get real URL from a shortened URL
export async function getRealURL(shortURL: string): Promise<string> {
  const foundUrl = cache.get(shortURL);
  if (foundUrl) {
    return foundUrl;
  }

  const response = await fetch(shortURL, {
    redirect: "manual",
  });
  const finalUrl = response.headers.get("location");
  if (!finalUrl) {
    throw new Error("No location header found");
  }

  // cancel the request after getting the location header
  response.body?.cancel();

  cache.set(shortURL, finalUrl);

  return finalUrl;
}

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

const _getTweetById = async (id: string): Promise<TwitterDetail> => {
  logger.info("get tweet by id", id);
  const params = new URLSearchParams({
    expansions: "author_id,attachments.media_keys",
    "user.fields": "name,username,profile_image_url",
    "tweet.fields":
      "attachments,conversation_id,referenced_tweets,created_at,entities,geo,id,public_metrics,source,text,author_id,lang",
    "media.fields": "url,alt_text",
  });

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const data = await twitterApi.url(`tweets/${id}?${params.toString()}`).get()
    .json();

  if (data.data?.text) {
    const urls = data.data.text?.match(urlRegex)?.filter(Boolean) ?? [];
    const text_urls = [];
    for (const url of urls) {
      try {
        const realUrl = await getRealURL(url.replace(",", ""));
        text_urls.push({
          original_url: url,
          url: realUrl,
        });
      } catch (error) {
        logger.error(error);
      }
    }
    data.data.text_urls = text_urls;
  }

  return data;
};

export const getTweetById: typeof _getTweetById = pMemoize(_getTweetById);

export const getThreadById = async (threadId: string, maxDepth = 5) => {
  logger.info("get tweet thread by", threadId);
  const ids: string[] = [threadId];
  const thread: Record<string, TwitterDetail> = {};

  let tweet = await getTweetById(threadId);
  logger.info("tweet", tweet);
  if (tweet.errors?.length) {
    // throw error message with details
    throw new Error(
      tweet.errors.map((e) => `${e.type}: ${e.detail}`).join(", "),
    );
  }

  thread[threadId] = tweet;

  const isThread = tweet.data?.id !== tweet.data?.conversation_id;

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
