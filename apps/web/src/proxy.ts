import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`);

  // Create request headers with additional context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", crypto.randomUUID());
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Continue to route with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security headers on the response
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "X-Request-Id",
    requestHeaders.get("x-request-id") ?? ""
  );

  return response;
}

// Only run proxy on page routes, not static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
