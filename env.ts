import "dotenv/load.ts";
import { cleanEnv, str } from "envalid";
import { logger } from "./logger.ts";

const report = (error: string) => {
  logger.error(error);
};

export const env = cleanEnv(
  Deno.env.toObject(),
  {
    JWT_TOKEN: str({
      desc: "your twitter token",
      docs: "https://developer.twitter.com/en/docs/tutorials/step-by-step-guide-to-making-your-first-request-to-the-twitter-api-v2",
    }),
  },
  {
    reporter: ({ errors, env }) => {
      if (Object.keys(errors).length > 0) {
        report(`Invalid environment variables: ${Object.keys(errors)}`);
        logger.info(env);
      }
    },
  }
);
