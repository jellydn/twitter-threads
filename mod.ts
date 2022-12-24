import wretch from "wretch";

import { env } from "./env.ts";

const twitterApi = wretch("https://api.twitter.com/2/")
  .auth(`Bearer ${env.JWT_TOKEN}`)
  .options({ credentials: "include", mode: "cors" });

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
