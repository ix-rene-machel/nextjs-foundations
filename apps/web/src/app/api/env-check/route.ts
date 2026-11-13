import { NextResponse } from "next/server";
import { missingEnvKeys, serverSchema } from "@/lib/env-schema";

// Edge runtime is deprecated in Next 16 (kept here only to demonstrate how env
// vars behave there). Remove this export to run on Node.js.
export const runtime = "edge";

export function GET(): NextResponse {
  // Server vars are read at request time from the edge process.env.
  const serverOk = serverSchema.safeParse(process.env).success;

  return NextResponse.json({
    runtime: process.env.NEXT_RUNTIME, // "edge" | "nodejs"
    serverEnvValid: serverOk,
    missing: missingEnvKeys(process.env), // names only, never values
    // Inlined at BUILD time (static reference): frozen until the next build.
    builtWithAppName: process.env.NEXT_PUBLIC_APP_NAME,
    // A dynamic lookup is NOT inlined; on the edge it resolves at runtime,
    // so a NEXT_PUBLIC value changed after build can differ from the above.
    runtimeAppName: process.env[["NEXT_PUBLIC", "APP_NAME"].join("_")],
  });
}
