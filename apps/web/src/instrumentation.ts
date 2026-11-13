import { validateEnv } from "./lib/env-schema";

// Runs once per server instance, before it takes requests. A misconfigured
// deployment fails here instead of on the first user request.
// The schema is runtime-agnostic, so it is safe for both nodejs and edge.
export function register(): void {
  validateEnv();
}
