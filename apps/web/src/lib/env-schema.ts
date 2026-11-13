import { z } from "zod";

/**
 * Pure, runtime-agnostic env validation (no `server-only`, no Node APIs), so the
 * same module runs in next.config.ts (build), instrumentation.ts (server start),
 * Node route handlers and edge route handlers.
 *
 * Build time vs runtime:
 * - `NEXT_PUBLIC_*` are inlined by the bundler at BUILD time, but only for
 *   static `process.env.NEXT_PUBLIC_X` references. They can't be read through a
 *   dynamic lookup (`process.env[name]`) and are frozen until the next build.
 * - Server-only vars are read at RUNTIME from `process.env` (also in the edge
 *   runtime), so validate them lazily, not at module scope of a prerendered file.
 */

// Treat an empty string (`FOO=`) like an unset variable.
const emptyToUndefined = (value: unknown): unknown =>
  value === "" ? undefined : value;

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());

export const serverSchema = z.object({
  INTERNAL_CONFIG: z.string().min(1),
  DATABASE_URL: optional(z.url()),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  NEXT_PUBLIC_GA_ID: optional(z.string()),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type EnvSource = Record<string, string | undefined>;

export class EnvValidationError extends Error {
  constructor(scope: string, error: z.ZodError) {
    super(`Invalid ${scope} environment variables:\n${z.prettifyError(error)}`);
    this.name = "EnvValidationError";
  }
}

export function parseServerEnv(source: EnvSource): ServerEnv {
  const result = serverSchema.safeParse(source);
  if (!result.success) throw new EnvValidationError("server", result.error);
  return result.data;
}

export function parseClientEnv(source: EnvSource): ClientEnv {
  const result = clientSchema.safeParse(source);
  if (!result.success) throw new EnvValidationError("client", result.error);
  return result.data;
}

/** Validate everything at once; used at build time and on server start. */
export function validateEnv(source: EnvSource = process.env): void {
  const server = serverSchema.safeParse(source);
  const client = clientSchema.safeParse(source);
  const problems = [
    server.success ? null : z.prettifyError(server.error),
    client.success ? null : z.prettifyError(client.error),
  ].filter((p): p is string => p !== null);

  if (problems.length > 0) {
    throw new Error(`Invalid environment variables:\n${problems.join("\n")}`);
  }
}

/** Names only, never values. Safe to expose in a diagnostics endpoint. */
export function missingEnvKeys(source: EnvSource): string[] {
  const keys = [
    ...Object.keys(serverSchema.shape),
    ...Object.keys(clientSchema.shape),
  ];
  return keys.filter((key) => !source[key]);
}
