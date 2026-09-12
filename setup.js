const fs = require('fs');
const path = require('path');

// Helper function to create directories and write files
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`✅ Created: ${filePath}`);
}

console.log(' Starting Decree Frontend Setup...\n');

// 1. Global CSS (Tailwind v4 Design System)
writeFile('src/app/globals.css', `
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;700;800;900&display=swap');

@theme {
  --color-base: #0a0d1c;
  --color-base-light: #1a1f3a;
  --color-primary: #ffb020;
  --color-primary-dark: #cc8d00;
  --color-secondary: #00d9b5;
  --color-secondary-dark: #00ad91;
  --color-destructive: #ff0040;

  --font-display: 'Space Grotesk', monospace;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --shadow-brutal: 6px 6px 0px 0px rgba(0,0,0,1);
  --shadow-brutal-hover: 8px 8px 0px 0px rgba(0,0,0,1);
  --shadow-brutal-active: 2px 2px 0px 0px rgba(0,0,0,1);
}

@layer base {
  body {
    font-family: var(--font-body);
    background-color: white;
    color: var(--color-base);
  }
}

@layer utilities {
  .brutal-card {
    @apply bg-white border-4 border-black shadow-brutal transition-all duration-200;
  }
  .brutal-card:hover {
    @apply -translate-x-0.5 -translate-y-0.5 shadow-brutal-hover;
  }
  .brutal-button {
    @apply font-display font-black uppercase tracking-tight border-4 border-black shadow-brutal transition-all duration-100 cursor-pointer inline-flex items-center justify-center;
  }
  .brutal-button:active {
    @apply translate-x-1 translate-y-1 shadow-brutal-active;
  }
  .brutal-input {
    @apply font-mono font-bold border-[3px] border-black outline-none transition-all duration-100 w-full p-4 bg-white;
  }
  .brutal-input:focus {
    @apply border-primary shadow-[4px_4px_0px_0px_#ffb020] -translate-x-0.5 -translate-y-0.5;
  }
}
`);

// 2. Utility Functions
writeFile('src/lib/utils.ts', `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
`);

// 3. UI Components
writeFile('src/components/ui/BrutalButton.tsx', `
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-base hover:bg-primary/90',
    secondary: 'bg-secondary text-base hover:bg-secondary/90',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-base',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button 
      className={cn('brutal-button', variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
`);

writeFile('src/components/ui/BrutalCard.tsx', `
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'amber' | 'teal' | 'error';
}

export const BrutalCard: React.FC<BrutalCardProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'border-l-[8px] border-l-base',
    amber: 'border-l-[8px] border-l-primary',
    teal: 'border-l-[8px] border-l-secondary',
    error: 'border-l-[8px] border-l-destructive',
  };

  return (
    <div 
      className={cn('brutal-card p-6', variants[variant], className)} 
      {...props}
    >
      {children}
    </div>
  );
};
`);

writeFile('src/components/ui/BrutalInput.tsx', `
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BrutalInput: React.FC<BrutalInputProps> = ({ label, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono font-bold uppercase mb-2 text-sm">
          {label}
        </label>
      )}
      <input className={cn('brutal-input', className)} {...props} />
    </div>
  );
};
`);

writeFile('src/components/ui/BrutalBadge.tsx', `
import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalBadgeProps {
  status: 'filed' | 'noticed' | 'conciliation' | 'decision' | 'execution' | 'closed';
  children?: React.ReactNode;
}

const statusConfig = {
  filed: { bg: 'bg-primary', text: 'text-base', label: 'FILED' },
  noticed: { bg: 'bg-purple-500', text: 'text-white', label: 'NOTICED' },
  conciliation: { bg: 'bg-secondary', text: 'text-base', label: 'CONCILIATION' },
  decision: { bg: 'bg-blue-600', text: 'text-white', label: 'DECISION' },
  execution: { bg: 'bg-destructive', text: 'text-white', label: 'EXECUTION' },
  closed: { bg: 'bg-base', text: 'text-white', label: 'CLOSED' },
};

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({ status, children }) => {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "px-3 py-1 border-[3px] border-black font-mono font-bold text-xs uppercase tracking-wide",
      config.bg, config.text
    )}>
      {children || config.label}
    </span>
  );
};
`);

// 4. Layout Component
writeFile('src/components/layout/Navbar.tsx', `
import { BrutalButton } from '@/components/ui/BrutalButton';

export const Navbar = () => {
  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black font-display tracking-tighter">DECREE</h1>
          <span className="hidden md:inline-block px-3 py-1 bg-primary text-base font-bold text-xs uppercase border-2 border-black">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="font-mono font-bold text-sm hover:text-primary transition-colors">[DOCUMENTATION]</a>
          <BrutalButton variant="outline" size="sm">Login</BrutalButton>
          <BrutalButton variant="primary" size="sm">Get Started</BrutalButton>
        </div>
      </div>
    </nav>
  );
};
`);

// 5. Landing Page
writeFile('src/app/page.tsx', `
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { FileText, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-base text-white py-20 md:py-32 border-b-4 border-black">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-black font-display tracking-tighter mb-6">
            DECREE
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-primary font-mono mb-8">
            GET WHAT'S OWED. FAST.
          </p>
          <div className="border-t-4 border-primary w-32 mb-8"></div>
          <p className="text-xl max-w-2xl font-body leading-relaxed text-gray-300 mb-12">
            A legal-tech platform that makes India's strongest MSME payment law actually usable. 
            Upload an invoice. Get paid.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <BrutalButton variant="primary" size="xl" className="text-base">
              Launch Decree <ArrowRight className="ml-2 w-6 h-6" />
            </BrutalButton>
            <BrutalButton variant="outline" size="xl" className="text-white border-white hover:bg-white hover:text-base">
              View Demo
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b-4 border-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrutalCard variant="amber">
              <div className="text-6xl font-black font-mono mb-2 text-primary">&lt;15%</div>
              <div className="text-lg font-bold uppercase tracking-wide font-display">Of MSMEs File Complaints</div>
            </BrutalCard>
            <BrutalCard variant="teal">
              <div className="text-6xl font-black font-mono mb-2 text-secondary">45 DAYS</div>
              <div className="text-lg font-bold uppercase tracking-wide font-display">Legal Payment Window</div>
            </BrutalCard>
            <BrutalCard variant="default">
              <div className="text-6xl font-black font-mono mb-2">~22%</div>
              <div className="text-lg font-bold uppercase tracking-wide font-display">Annual Penal Interest</div>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 border-b-4 border-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black font-display mb-12 tracking-tight">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Upload Invoice", desc: "Drop your invoice PDF or photo. AI extracts all details automatically." },
              { icon: Clock, title: "Auto-Calculate", desc: "Interest computed at 3× RBI rate. Eligibility checked instantly." },
              { icon: TrendingUp, title: "File & Track", desc: "Generate filing packet. Track deadlines until money arrives." },
            ].map((feature, index) => (
              <BrutalCard key={index} variant="amber" className="h-full">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-black font-display mb-3 uppercase">{feature.title}</h3>
                <p className="text-base font-body text-gray-600">{feature.desc}</p>
              </BrutalCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="border-4 border-primary p-10 md:p-16 bg-base shadow-[8px_8px_0px_0px_#ffb020]">
            <h2 className="text-4xl md:text-6xl font-black font-display mb-6 tracking-tight text-white">
              STOP WAITING.<br />START FILING.
            </h2>
            <BrutalButton variant="primary" size="xl" className="text-lg mt-4">
              Get Started Now <ArrowRight className="ml-2 w-6 h-6" />
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-12">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="font-display font-black text-2xl tracking-tight">DECREE</div>
          <div className="font-mono text-sm text-gray-600">© 2026 Decree. Built for MSMEs.</div>
        </div>
      </footer>
    </main>
  );
}
`);

console.log('\n🎉 Setup complete! Run "npm run dev" to see your brutalist UI!');