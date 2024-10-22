import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    UPLOADTHING_SECRET: z.string().min(72),
    UPLOADTHING_APP_ID: z.string().min(10),
    MONGODB_URI: z.string().min(90),
    OPENCAGE_API_KEY: z.string().min(32),
    GEONAMES_USERNAME: z.string().min(8),
    REDIS_URL: z.string().min(90),
    MAPBOX_API: z.string().min(90),
    PUSHER_APP_ID: z.string(),
    PUSHER_KEY: z.string(),
    PUSHER_SECRET: z.string(),
    PUSHER_CLUSTER: z.string(),
  },

  client: {
    NEXT_PUBLIC_PUSHER_KEY: z.string(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    OPENCAGE_API_KEY: process.env.OPENCAGE_API_KEY,
    GEONAMES_USERNAME: process.env.GEONAMES_USERNAME,
    REDIS_URL: process.env.REDIS_URL,
    MAPBOX_API: process.env.MAPBOX_API,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
