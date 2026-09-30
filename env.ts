import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DUCKDB_QUACK_ENDPOINT: z.string().min(1).default("quack:localhost:9494"),
    DUCKDB_QUACK_TOKEN: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
