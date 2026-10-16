'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const NAV = [
  { href: '/#how', label: 'How it Works' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/upload', label: 'Upload' },
];

/**
 * Sticky navbar: hides on scroll down, reveals on scroll up; subtle blur on
 * scroll. Collapses to a clean mobile drawer under md.
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out',
        hidden ? '-translate-y-full' : 'translate-y-0',
        scrolled && 'border-b border-line bg-canvas/85 backdrop-blur-md',
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 text-primary" aria-label="DECREE home">
          <Scale size={20} strokeWidth={1.5} />
          <span className="font-serif text-xl font-semibold tracking-[0.14em]">DECREE</span>
        </Link>

        {/* Center links — desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="link-draw text-sm font-medium text-muted transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Button variant="ghost" size="sm" href="/sign-in">Log In</Button>
            <Button variant="primary" size="sm" href="/sign-up">Get Started</Button>
          </SignedOut>
          <SignedIn>
            <span className="text-sm text-muted">
              {user?.firstName ? `Hi, ${user.firstName}` : ''}
            </span>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-11 w-11 place-items-center rounded-control text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'overflow-hidden border-b border-line bg-canvas transition-[max-height] duration-300 ease-out md:hidden',
          open ? 'max-h-96' : 'max-h-0 border-b-0',
        )}
      >
        <div className="space-y-1 px-6 py-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block min-h-[44px] py-2.5 text-[16px] font-medium text-ink">
              {n.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <SignedOut>
              <Button variant="secondary" href="/sign-in" className="flex-1">Log In</Button>
              <Button variant="primary" href="/sign-up" className="flex-1">Get Started</Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
