import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// ============================================================================
// DECREE middleware — SINGLE source of truth (previously two conflicting
// files existed at /middleware.ts and /src/middleware.ts).
//
// Policy:
//  - App pages that show tenant data require auth.
//  - ALL internal API routes require auth EXCEPT the public rate feed.
//  - Auth is ALSO enforced inside every route via requireOrg() — defense in
//    depth; middleware alone is never trusted for data scoping.
// ============================================================================

const isProtectedPage = createRouteMatcher([
  '/dashboard(.*)',
  '/upload(.*)',
  '/calculator(.*)',
  '/case(.*)',
  '/settings(.*)',
]);

const isPublicApi = createRouteMatcher(['/api/rates(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;
  const isApi = url.startsWith('/api/');
  if (isProtectedPage(req) || (isApi && !isPublicApi(req))) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
