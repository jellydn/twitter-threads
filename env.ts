import { config } from "dotenv/mod.ts";
import { cleanEnv, str } from "envalid";
import { logger } from "./logger.ts";

const report = (error: string) => {
  logger.error(error);
};

export const env = cleanEnv(
  config({
    safe: true, // Set to true to ensure that all necessary environment variables are defined after reading from .env. It will read .env.example to get the list of needed variables.
  }),
  {
    JWT_TOKEN: str({
      desc: "your twitter token",
      docs:
        "https://developer.twitter.com/en/docs/tutorials/step-by-step-guide-to-making-your-first-request-to-the-twitter-api-v2",
    }),
  },
  {
    reporter: ({ errors }) => {
      if (Object.keys(errors).length > 0) {
        report("Invalid environment variables: " + Object.keys(errors));
      }
    },
  },
);
