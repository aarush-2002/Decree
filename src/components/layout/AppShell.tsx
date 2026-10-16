'use client';
// Shared chrome for the signed-in app: top bar + calm page entrance.
// Motion inside the tool is deliberately restrained (fade + 8px, 0.4s once).
import Link from 'next/link';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary" aria-label="DECREE dashboard">
            <Scale size={18} strokeWidth={1.5} />
            <span className="font-serif text-lg font-semibold tracking-[0.14em]">DECREE</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex" aria-label="App">
            <Link href="/dashboard" className="link-draw hover:text-ink">Dashboard</Link>
            <Link href="/upload" className="link-draw hover:text-ink">New case</Link>
            <Link href="/settings" className="link-draw hover:text-ink">Settings</Link>
          </nav>
          <div className="flex items-center gap-3">
            <SignedIn>
              <span className="hidden text-sm text-muted sm:inline">{useUser().user?.firstName ?? ''}</span>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button size="sm" href="/sign-in">Log in</Button>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-10 animate-[pageIn_0.4s_ease-out]">
        <style>{`@keyframes pageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){@keyframes pageIn{from{opacity:0}to{opacity:1}}}`}</style>
        {children}
      </main>
    </div>
  );
}
