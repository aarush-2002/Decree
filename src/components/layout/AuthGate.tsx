'use client';
import { useUser } from '@clerk/nextjs';

/**
 * Clerk v7 (Core 3) removed <SignedIn>/<SignedOut>. These shims keep the same
 * declarative API using useUser() — `isLoaded === false` renders nothing so we
 * never flash the wrong state during hydration.
 */
export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}
