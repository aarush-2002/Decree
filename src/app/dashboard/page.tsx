'use client';

import { useEffect, useState } from 'react';  // ← THIS LINE IS MISSING OR BROKEN
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
// ... rest of imports
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalButton } from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { Plus, FileText, Scale, Clock, TrendingUp } from 'lucide-react';

// Force this page to be dynamic (no SSR)
export const dynamic = 'force-dynamic';

interface Case {
  id: string;
  client: string;
  buyer: string;
  amount: string;
  status: string;
  daysOverdue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

    useEffect(() => {
    setIsClient(true);
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        // CRITICAL FIX: Check if data is actually an array before using it
        if (Array.isArray(data)) {
          setCases(data);
        } else {
          console.log("API returned non-array data (maybe not logged in?):", data);
          setCases([]); // Fallback to empty list so it doesn't crash
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch cases:', err);
        setCases([]); // Fallback to empty list
        setLoading(false);
      });
  }, []);
  // Don't render anything until client is mounted
  if (!isClient) {
    return (
      <main className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-spin text-[#ffb020]" />
          <p className="font-mono">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black font-display tracking-tight uppercase">Your Cases</h1>
            <p className="font-mono text-gray-400 mt-2">Track and manage your delayed payment claims</p>
          </div>
          <Link href="/upload">
            <BrutalButton variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" /> New Case
            </BrutalButton>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 animate-spin" />
            Loading cases...
          </div>
        ) : cases.length === 0 ? (
          <BrutalCard variant="default" className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 text-gray-600" />
            <h2 className="text-3xl font-black font-display uppercase mb-4">No Cases Yet</h2>
            <p className="font-mono text-gray-400 mb-8 max-w-md mx-auto">
              Upload your first invoice to start tracking a delayed payment claim
            </p>
            <Link href="/upload">
              <BrutalButton variant="primary" size="xl">
                Upload Invoice
              </BrutalButton>
            </Link>
          </BrutalCard>
        ) : (
          <div className="space-y-6">
            {cases.map((caseItem) => (
              <BrutalCard key={caseItem.id} variant="default" className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Scale className="w-6 h-6 text-[#ffb020]" />
                      <h3 className="text-2xl font-black font-display uppercase">
                        {caseItem.id}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
                      <div>
                        <span className="text-gray-500">Client:</span>
                        <span className="ml-2 text-white">{caseItem.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Buyer:</span>
                        <span className="ml-2 text-white">{caseItem.buyer}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-2 text-[#ffb020] font-bold">₹{parseInt(caseItem.amount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="inline-block px-4 py-2 bg-[#ffb020] text-black font-black font-mono uppercase">
                      {caseItem.status}
                    </div>
                    <div className="flex items-center gap-2 text-destructive font-mono">
                      <TrendingUp className="w-4 h-4" />
                      <span>{caseItem.daysOverdue} days overdue</span>
                    </div>
                    <Link href={`/case/${caseItem.id}`}>
                      <BrutalButton variant="outline" size="sm">
                        View Details
                      </BrutalButton>
                    </Link>
                  </div>
                </div>
              </BrutalCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}