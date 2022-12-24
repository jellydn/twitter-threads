import { cleanEnv, str } from "envalid";

export const env = cleanEnv(Deno.env.toObject(), {
  JWT_TOKEN: str({
    desc: "your twitter token",
    docs: "https://developer.twitter.com/en/docs/tutorials/step-by-step-guide-to-making-your-first-request-to-the-twitter-api-v2",
  }),
});
