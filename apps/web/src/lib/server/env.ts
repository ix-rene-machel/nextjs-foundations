import "server-only";
import { parseServerEnv, type ServerEnv } from "../env-schema";

let cached: ServerEnv | undefined;

/**
 * Validated server env, read lazily at runtime (first call), then memoized.
 * Never call at module scope of a prerendered file: that would freeze the
 * build-time values.
 */
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
