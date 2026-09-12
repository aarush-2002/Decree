'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import { PageTransition } from '@/components/ui/PageTransition';
import { Plus, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from our backend API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <PageTransition>
        <Navbar />
        
        {/* Stats Section */}
        <section className="border-b-4 border-black bg-white">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <BrutalCard variant="amber">
                <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Total Recoverable</div>
                <div className="text-5xl font-black text-primary font-mono">Rs. 18.8L</div>
              </BrutalCard>
              <BrutalCard variant="teal">
                <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Active Cases</div>
                <div className="text-5xl font-black text-secondary font-mono">{cases.length}</div>
              </BrutalCard>
              <BrutalCard variant="default">
                <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Resolved</div>
                <div className="text-5xl font-black font-mono">6</div>
              </BrutalCard>
              <BrutalCard variant="error">
                <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Overdue</div>
                <div className="text-5xl font-black text-destructive font-mono">3</div>
              </BrutalCard>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-black font-display tracking-tight">ACTIVE CASES</h2>
            <BrutalButton variant="primary" size="md"><Plus className="w-5 h-5 mr-2" /> New Case</BrutalButton>
          </div>

          <div className="bg-white border-4 border-black shadow-brutal overflow-x-auto">
            <div className="bg-base text-white border-b-4 border-black">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 font-mono font-bold text-sm uppercase min-w-[800px]">
                <div className="col-span-2">Case ID</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-2">Buyer</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Days</div>
              </div>
            </div>

            <div className="divide-y-2 divide-black">
              {loading ? (
                <div className="p-12 text-center font-mono font-bold">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  Fetching from Neon Database...
                </div>
              ) : cases.length === 0 ? (
                <div className="p-12 text-center font-mono font-bold text-gray-500">
                  No cases found. Run the seed script!
                </div>
              ) : (
                cases.map((c) => (
                  <Link 
                    href={`/case/${c.id}`} 
                    key={c.id} 
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center font-mono hover:bg-gray-50 border-l-8 border-l-primary transition-colors cursor-pointer min-w-[800px]"
                  >
                    <div className="col-span-2 font-bold">{c.id}</div>
                    <div className="col-span-3 font-bold">{c.client}</div>
                    <div className="col-span-2">{c.buyer}</div>
                    <div className="col-span-2 font-bold">Rs. {(c.amount/1000).toFixed(0)}K</div>
                    <div className="col-span-1"><BrutalBadge status={c.status as any} /></div>
                    <div className="col-span-2 font-bold text-red-600">{c.daysOverdue} days</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </PageTransition>
    </main>
  );
}