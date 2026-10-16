import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { MotionProvider } from '@/components/marketing/MotionProvider';
import { Preloader } from '@/components/marketing/Preloader';
import { CustomCursor } from '@/components/marketing/CustomCursor';
import { RevealScript } from '@/components/marketing/RevealScript';

export const metadata: Metadata = {
  title: { default: 'DECREE — Get what’s owed. Fast.', template: '%s · DECREE' },
  description:
    'Turn overdue invoices into court-ready Section 16 interest claims in 60 seconds. Built for Indian MSMEs.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

/** Clerk appearance API — restyled to the DECREE editorial system. */
const clerkAppearance = {
  variables: {
    colorPrimary: '#14352a',
    colorBackground: '#fffdf9',
    colorText: '#14161a',
    colorTextSecondary: '#6b6760',
    colorInputBackground: '#faf8f4',
    colorInputText: '#14161a',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
  },
  elements: {
    card: 'border border-[#e6e1d8] shadow-none rounded-[12px]',
    headerTitle: 'font-serif',
    footerActionLink: 'text-[#b08a3e]',
    formButtonPrimary: 'bg-[#14352a] hover:bg-[#0c211a] shadow-none',
  },
} as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body className="grain antialiased">
          <MotionProvider>
            <Preloader />
            <CustomCursor />
            <RevealScript />
            {children}
          </MotionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
