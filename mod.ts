import wretch from "wretch";

import { env } from "./env.ts";

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

export const getTweetById = (id: string) => {
  const params = new URLSearchParams({
    expansions: "author_id",
    "user.fields": "name,username,profile_image_url",
    "tweet.fields": "referenced_tweets,created_at",
    "media.fields": "url,alt_text",
  });

  return twitterApi.url(`tweets/${id}?${params.toString()}`).get();
};

export const getThreadById = async (threadId: string) => {
  const ids: string[] = [threadId];

  const tweet = await getTweetById(threadId);

  // TODO: get all related tweet with referenced_tweets

  return {
    ids,
    tweet,
  };
};
