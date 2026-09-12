import Link from 'next/link';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { SignInButton, UserButton } from '@clerk/nextjs';

export const Navbar = () => {
  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black font-display tracking-tighter">DECREE</Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-mono font-bold text-sm hover:text-primary hidden md:block">[DASHBOARD]</Link>
          <Link href="/upload" className="font-mono font-bold text-sm hover:text-primary hidden md:block">[UPLOAD]</Link>
          <Link href="/calculator" className="font-mono font-bold text-sm hover:text-primary hidden md:block">[CALCULATOR]</Link>
          
          {/* Clerk Auth Buttons - Updated for v5 */}
          <SignInButton mode="modal">
            <BrutalButton variant="outline" size="sm">Login</BrutalButton>
          </SignInButton>
          
          <SignInButton mode="modal">
            <BrutalButton variant="primary" size="sm">Get Started</BrutalButton>
          </SignInButton>
          
          <UserButton />
        </div>
      </div>
    </nav>
  );
};