// ============================================================================
// DECREE — Server-side auth + tenant scope helper
//
// Fixes:
//  - Every API route previously either had NO auth (calculate-interest wrote
//    to the DB unauthenticated) or used an unsafe "fallback to all invoices"
//    that leaked every organization's data. This helper makes scoped access
//    the ONLY way routes can reach Prisma, and fails CLOSED (401/404), never
//    open.
// ============================================================================

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from './prisma';

export interface OrgContext {
  clerkId: string;
  userId: string;   // internal DB user id
  orgId: string;    // tenant id — every query MUST filter by this
  name: string;
  role: string;
}

/**
 * Resolve the authenticated Clerk user to their internal org context.
 * Returns a NextResponse error (401/404/503) when the caller cannot be
 * resolved — callers should return it directly.
 */
export async function requireOrg(): Promise<{ ctx: OrgContext } | { error: NextResponse }> {
  if (!prisma) {
    return {
      error: NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL.' },
        { status: 503 },
      ),
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, orgId: true, name: true, role: true },
  });

  if (!dbUser) {
    // Authenticated via Clerk but not provisioned in our DB yet.
    // Fail CLOSED — do NOT fall back to cross-tenant reads.
    return {
      error: NextResponse.json(
        { error: 'Account not provisioned. Contact your workspace admin.' },
        { status: 404 },
      ),
    };
  }

  return {
    ctx: {
      clerkId: userId,
      userId: dbUser.id,
      orgId: dbUser.orgId,
      name: dbUser.name,
      role: dbUser.role,
    },
  };
}

/** True when the response object is an error to short-circuit with. */
export function isErrorResponse(
  r: { ctx: OrgContext } | { error: NextResponse },
): r is { error: NextResponse } {
  return 'error' in r;
}
