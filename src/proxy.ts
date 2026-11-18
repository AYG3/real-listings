import { NextResponse, type NextRequest } from "next/server";

const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  "X-DNS-Prefetch-Control": "on",
};

const portalHomes = {
  "/admin": "/admin/overview",
  "/agent": "/agent/dashboard",
} as const;

function hasSessionCookie(request: NextRequest) {
  // Optimistic check only — layouts and server actions remain the source of truth.
  return request.cookies
    .getAll()
    .some(({ name }) => name.includes("better-auth"));
}

function withSecurityHeaders(response: NextResponse) {
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Segment-aware: `/agents` is the public directory, not the agent portal.
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAgentArea = pathname === "/agent" || pathname.startsWith("/agent/");
  const isPortal = isAdminArea || isAgentArea;
  const isPortalAuth =
    pathname.startsWith("/admin/auth") || pathname.startsWith("/agent/auth");
  const loginPath = isAdminArea ? "/admin/auth/login" : "/agent/auth/login";

  // Optimistic gate: no session cookie means no access to a portal page.
  if (isPortal && !isPortalAuth && !hasSessionCookie(request)) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(loginPath, request.url)),
    );
  }

  const home = portalHomes[pathname as keyof typeof portalHomes];
  if (home) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(home, request.url)),
    );
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
