import { connection, NextResponse } from "next/server";
import { missingEnvKeys, serverSchema } from "@/lib/env-schema";

// This route used to run on the edge runtime (task 04). Cache Components
// (task 16) requires Node.js and rejects any `runtime` export, so it was removed.
export async function GET(): Promise<NextResponse> {
  // Opt this handler into per-request execution. Under Cache Components a
  // handler with no request access is prerendered at build, which would freeze
  // process.env and defeat the build-time vs runtime comparison.
  await connection();

  // Server vars are read at request time from process.env.
  const serverOk = serverSchema.safeParse(process.env).success;

  return NextResponse.json({
    runtime: process.env.NEXT_RUNTIME, // "edge" | "nodejs"
    serverEnvValid: serverOk,
    missing: missingEnvKeys(process.env), // names only, never values
    // Inlined at BUILD time (static reference): frozen until the next build.
    builtWithAppName: process.env.NEXT_PUBLIC_APP_NAME,
    // A dynamic lookup is NOT inlined; it resolves at runtime,
    // so a NEXT_PUBLIC value changed after build can differ from the above.
    runtimeAppName: process.env[["NEXT_PUBLIC", "APP_NAME"].join("_")],
  });
}
