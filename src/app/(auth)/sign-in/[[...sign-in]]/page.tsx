import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = { title: 'Log in' };

// Clerk's unified SignIn carries the forgot-password flow out of the box.
export default function Page() {
  return <SignIn routing="hash" fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />;
}
