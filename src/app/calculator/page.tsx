'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { Calculator } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

export default function CalculatorPage() {
  const [days, setDays] = useState(90);
  const principal = 450000;
  const interest = (principal * 19.5 * days) / (365 * 100);
  
  return (
    <main className="min-h-screen bg-gray-100">
        <PageTransition>
      <Navbar />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-5xl font-black font-display mb-8 tracking-tight">INTEREST CALCULATOR</h1>
        <BrutalCard variant="teal" className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary border-4 border-black flex items-center justify-center"><Calculator className="w-8 h-8" /></div>
            <div><div className="text-2xl font-black font-display uppercase">Eligible for Filing</div></div>
          </div>
        </BrutalCard>
        <BrutalCard variant="amber" className="mb-8">
          <h2 className="text-2xl font-black font-display uppercase mb-6 border-b-4 border-black pb-4">Penal Interest Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-sm font-mono font-bold uppercase mb-2">Principal</div>
              <div className="text-4xl font-black font-mono mb-4">Rs. {(principal/1000).toFixed(0)}K</div>
              <div className="text-sm font-mono font-bold uppercase mb-2">Days Overdue</div>
              <div className="text-4xl font-black font-mono text-primary mb-4">{days} days</div>
            </div>
            <div className="bg-base text-white p-6 border-4 border-black">
              <div className="text-sm font-mono uppercase mb-2 text-gray-400">Interest Accrued</div>
              <div className="text-6xl font-black font-mono text-primary">Rs. {interest.toFixed(0)}</div>
            </div>
          </div>
          <input type="range" min="0" max="365" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full h-6 border-3 border-black bg-gray-200" />
          <div className="flex justify-between text-xs font-mono mt-2"><span>0 days</span><span>365 days</span></div>
        </BrutalCard>
        <div className="flex gap-4">
          <BrutalButton variant="primary" size="xl" className="flex-1">Generate Filing Packet -&gt;</BrutalButton>
        </div>
      </div>
      </PageTransition>
    </main>
  );
}