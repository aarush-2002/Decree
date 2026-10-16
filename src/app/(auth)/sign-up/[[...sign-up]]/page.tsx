import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = { title: 'Get started' };

export default function Page() {
  return <SignUp routing="hash" fallbackRedirectUrl="/dashboard" signInUrl="/sign-in" />;
}
