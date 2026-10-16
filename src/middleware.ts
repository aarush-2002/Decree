import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// ============================================================================
// DECREE middleware — single source of truth (previously TWO conflicting
// middleware.ts files existed: /middleware.ts and /src/middleware.ts; the
// root one shadowed the src one and the src one protected nothing).
//
// Reimagined policy:
//  - App pages that show tenant data require auth.
//  - ALL internal API routes require auth EXCEPT the public rate feed.
//  - Auth is ALSO enforced inside every route via requireOrg() (defense in
//    depth) — middleware alone is not trusted for data scoping.
// ============================================================================

const isProtectedPage = createRouteMatcher([
  '/dashboard(.*)',
  '/upload(.*)',
  '/calculator(.*)',
  '/case(.*)',
  '/settings(.*)',
])

// Internal APIs are protected; only the read-only public rate endpoint is open.
const isPublicApi = createRouteMatcher(['/api/rates(.*)'])
const isApiRoute = createRouteMatcher(['/api(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedPage(req) || (isApiRoute(req) && !isPublicApi(req))) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
