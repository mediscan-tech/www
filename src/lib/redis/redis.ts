import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// const getRedisUrl = () => {
//   if (process.env.REDIS_URL) return process.env.REDIS_URL;
//   throw new Error("REDIS_URL not set in environment variables");
// };

// export const redis = new Redis(getRedisUrl());
