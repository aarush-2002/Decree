const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`✅ Created: ${filePath}`);
}

console.log('🚀 Starting Mega-Step 2: Dashboard, Upload & Calculator...\n');

// 1. Dashboard Page
writeFile('src/app/dashboard/page.tsx', `
'use client';

import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import { formatCurrency } from '@/lib/utils';
import { Bell, FileText, Plus, Search, Filter } from 'lucide-react';

const mockCases = [
  { id: 'CASE-001', client: 'Sharma Industries', buyer: 'Tata Motors', amount: 450000, status: 'filed', daysOverdue: 120, deadline: '2026-09-15' },
  { id: 'CASE-002', client: 'Patel Traders', buyer: 'Reliance Industries', amount: 280000, status: 'conciliation', daysOverdue: 95, deadline: '2026-09-18' },
  { id: 'CASE-003', client: 'Kumar Exports', buyer: 'Infosys Ltd', amount: 620000, status: 'noticed', daysOverdue: 60, deadline: '2026-09-20' },
  { id: 'CASE-004', client: 'Singh Manufacturing', buyer: 'BHEL', amount: 190000, status: 'execution', daysOverdue: 180, deadline: '2026-09-12' },
  { id: 'CASE-005', client: 'Reddy Textiles', buyer: 'Amazon India', amount: 340000, status: 'closed', daysOverdue: 0, deadline: '-' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Top Stats Bar */}
      <section className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BrutalCard variant="amber">
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Total Recoverable</div>
              <div className="text-5xl font-black text-primary font-mono">{formatCurrency(1880000)}</div>
              <div className="mt-3 text-sm font-bold border-t-3 border-black pt-2">+₹2.4L this week</div>
            </BrutalCard>
            
            <BrutalCard variant="teal">
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Active Cases</div>
              <div className="text-5xl font-black text-secondary font-mono">14</div>
              <div className="mt-3 text-sm font-bold border-t-3 border-black pt-2">3 deadlines this week</div>
            </BrutalCard>
            
            <BrutalCard variant="default">
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Resolved (Qtr)</div>
              <div className="text-5xl font-black font-mono">6</div>
              <div className="mt-3 text-sm font-bold text-secondary border-t-3 border-black pt-2">₹18.4L recovered</div>
            </BrutalCard>
            
            <BrutalCard variant="error">
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-2">Overdue</div>
              <div className="text-5xl font-black text-destructive font-mono">3</div>
              <div className="mt-3 text-sm font-bold text-destructive border-t-3 border-black pt-2">Action required</div>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* Cases Table Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-black font-display tracking-tight">ACTIVE CASES</h2>
          <BrutalButton variant="primary" size="md">
            <Plus className="w-5 h-5 mr-2" /> New Case
          </BrutalButton>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by Case ID, Client, or Buyer..."
              className="brutal-input pl-12"
            />
          </div>
          <BrutalButton variant="outline" size="md">
            <Filter className="w-5 h-5 mr-2" /> Filter
          </BrutalButton>
        </div>

        {/* Cases Table */}
        <div className="bg-white border-4 border-black shadow-brutal">
          {/* Table Header */}
          <div className="bg-base text-white border-b-4 border-black">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 font-mono font-bold text-sm uppercase">
              <div className="col-span-2">Case ID</div>
              <div className="col-span-3">Client</div>
              <div className="col-span-2">Buyer</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Deadline</div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y-2 divide-black">
            {mockCases.map((caseItem) => (
              <div 
                key={caseItem.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center font-mono hover:bg-gray-50 transition-colors cursor-pointer border-l-8 border-l-primary"
              >
                <div className="col-span-2 font-bold">{caseItem.id}</div>
                <div className="col-span-3 font-bold">{caseItem.client}</div>
                <div className="col-span-2">{caseItem.buyer}</div>
                <div className="col-span-2 font-black text-lg">{formatCurrency(caseItem.amount)}</div>
                <div className="col-span-1">
                  <BrutalBadge status={caseItem.status as any} />
                </div>
                <div className="col-span-2 font-bold text-red-600">
                  {caseItem.daysOverdue > 0 ? `${caseItem.daysOverdue} days overdue` : 'Completed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
`);

// 2. Upload Page
writeFile('src/app/upload/page.tsx', `
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { Upload, FileText, Check, AlertTriangle } from 'lucide-react';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);
    
    // Simulate AI extraction delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsExtracted(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-5xl font-black font-display mb-8 tracking-tight">
          UPLOAD INVOICE
        </h1>

        {!isExtracted ? (
          <>
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={\`
                border-6 border-black border-dashed bg-white p-16 md:p-24 text-center
                shadow-brutal transition-all duration-200 cursor-pointer
                \${isDragging ? 'bg-primary/10 -translate-x-1 -translate-y-1 shadow-brutal-hover' : ''}
              \`}
            >
              <div className="text-7xl mb-6 flex justify-center">
                <Upload className="w-20 h-20" />
              </div>
              <h2 className="text-3xl font-black uppercase mb-4 font-display">
                Drop Invoice Here
              </h2>
              <p className="text-lg font-mono mb-8 text-gray-600">
                PDF, JPG, PNG — Max 10MB
              </p>
              <BrutalButton variant="outline" size="lg">
                Or Click to Browse
              </BrutalButton>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="mt-8 border-4 border-black bg-base text-primary p-8 shadow-brutal">
                <div className="text-2xl font-mono font-bold animate-brutal-pulse">
                  {'>'} EXTRACTING DATA...
                </div>
                <div className="mt-4 font-mono text-sm">
                  Reading invoice number, dates, amounts, buyer details
                </div>
                <div className="mt-6 h-4 bg-gray-800 border-3 border-primary">
                  <div className="h-full bg-primary w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Extraction Results */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PDF Preview */}
            <BrutalCard variant="default">
              <h3 className="text-xl font-black uppercase mb-4 font-display border-b-4 border-black pb-2">
                Original Document
              </h3>
              <div className="aspect-[3/4] bg-gray-200 border-3 border-black flex items-center justify-center">
                <FileText className="w-20 h-20 text-gray-400" />
              </div>
            </BrutalCard>

            {/* Extracted Fields */}
            <BrutalCard variant="amber">
              <h3 className="text-xl font-black uppercase mb-6 font-display border-b-4 border-black pb-2">
                Extracted Data
              </h3>
              
              <div className="space-y-4">
                <BrutalInput 
                  label="Invoice Number"
                  defaultValue="INV-2026-001234"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <BrutalInput 
                    label="Invoice Date"
                    type="date"
                    defaultValue="2026-08-01"
                  />
                  <BrutalInput 
                    label="Amount (₹)"
                    type="number"
                    defaultValue="450000"
                  />
                </div>

                <BrutalInput 
                  label="Buyer Name"
                  defaultValue="Tata Motors Ltd"
                />

                <BrutalInput 
                  label="Buyer GSTIN"
                  defaultValue="27AAACT1234C1Z5"
                />

                <div className="pt-6 flex gap-4">
                  <BrutalButton 
                    variant="outline" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => setIsExtracted(false)}
                  >
                    Re-Extract
                  </BrutalButton>
                  <BrutalButton 
                    variant="primary" 
                    size="lg" 
                    className="flex-1"
                  >
                    Confirm & Continue →
                  </BrutalButton>
                </div>
              </div>
            </BrutalCard>
          </div>
        )}
      </div>
    </main>
  );
}
`);

// 3. Calculator Page
writeFile('src/app/calculator/page.tsx', `
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function CalculatorPage() {
  const [sliderValue, setSliderValue] = useState(90);
  
  const principal = 450000;
  const rbiRate = 6.5;
  const penalRate = rbiRate * 3; // 19.5%
  const daysOverdue = sliderValue;
  const interest = (principal * penalRate * daysOverdue) / (365 * 100);
  const total = principal + interest;

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <BrutalButton variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
        </BrutalButton>

        <h1 className="text-5xl font-black font-display mb-8 tracking-tight">
          INTEREST CALCULATOR
        </h1>

        {/* Invoice Summary */}
        <BrutalCard variant="default" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-1">Invoice #</div>
              <div className="text-xl font-bold font-mono">INV-2026-001234</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-1">Buyer</div>
              <div className="text-xl font-bold font-mono">Tata Motors Ltd</div>
            </div>
            <div>
              <div className="text-sm font-mono font-bold uppercase text-gray-600 mb-1">Due Date</div>
              <div className="text-xl font-bold font-mono">Sept 15, 2026</div>
            </div>
          </div>
        </BrutalCard>

        {/* Eligibility Status */}
        <BrutalCard variant="teal" className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-secondary border-4 border-black flex items-center justify-center">
              <Calculator className="w-8 h-8 text-base" />
            </div>
            <div>
              <div className="text-2xl font-black font-display uppercase">✓ Eligible for Filing</div>
              <div className="text-base font-mono mt-1">
                45-day payment window exceeded. Penal interest applicable.
              </div>
            </div>
          </div>
        </BrutalCard>

        {/* Interest Calculator */}
        <BrutalCard variant="amber" className="mb-8">
          <h2 className="text-2xl font-black font-display uppercase mb-6 border-b-4 border-black pb-4">
            Penal Interest Calculation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-sm font-mono font-bold uppercase mb-2">Principal Amount</div>
              <div className="text-4xl font-black font-mono mb-4">{formatCurrency(principal)}</div>
              
              <div className="text-sm font-mono font-bold uppercase mb-2">Days Overdue</div>
              <div className="text-4xl font-black font-mono text-primary mb-4">{daysOverdue} days</div>
              
              <div className="text-sm font-mono font-bold uppercase mb-2">RBI Rate (3x)</div>
              <div className="text-2xl font-bold font-mono">{rbiRate}% × 3 = {penalRate}% p.a.</div>
            </div>

            <div className="bg-base text-white p-6 border-4 border-black">
              <div className="text-sm font-mono uppercase mb-2 text-gray-400">Interest Accrued</div>
              <div className="text-6xl font-black font-mono text-primary mb-2">
                {formatCurrency(interest)}
              </div>
              <div className="text-sm font-mono text-gray-400">
                Total Claim: {formatCurrency(total)}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <label className="block text-sm font-mono font-bold uppercase mb-4">
              Adjust Days Overdue: {daysOverdue} days
            </label>
            <input
              type="range"
              min="0"
              max="365"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-6 border-3 border-black bg-gray-200 appearance-none cursor-pointer"
              style={{
                background: \`linear-gradient(to right, #ffb020 0%, #ffb020 \${(sliderValue / 365) * 100}%, #d0d0d0 \${(sliderValue / 365) * 100}%, #d0d0d0 100%)\`
              }}
            />
            <div className="flex justify-between text-xs font-mono mt-2">
              <span>0 days</span>
              <span>180 days</span>
              <span>365 days</span>
            </div>
          </div>

          {/* RBI Rate Info */}
          <div className="border-t-3 border-black pt-4">
            <div className="text-sm font-mono">
              <span className="font-bold">Note:</span> Interest calculated at 3× RBI bank rate as per MSMED Act Section 16.
              Current RBI rate: {rbiRate}% (Updated: Sept 2026)
            </div>
          </div>
        </BrutalCard>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <BrutalButton variant="outline" size="xl" className="flex-1">
            Save for Later
          </BrutalButton>
          <BrutalButton variant="primary" size="xl" className="flex-1">
            Generate Filing Packet →
          </BrutalButton>
        </div>
      </div>
    </main>
  );
}
`);

// 4. Update Navbar to include navigation links
writeFile('src/components/layout/Navbar.tsx', `
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/BrutalButton';

export const Navbar = () => {
  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <h1 className="text-2xl font-black font-display tracking-tighter">DECREE</h1>
          <span className="hidden md:inline-block px-3 py-1 bg-primary text-base font-bold text-xs uppercase border-2 border-black">
            Beta
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-mono font-bold text-sm hover:text-primary transition-colors hidden md:block">
            [DASHBOARD]
          </Link>
          <Link href="/upload" className="font-mono font-bold text-sm hover:text-primary transition-colors hidden md:block">
            [UPLOAD]
          </Link>
          <Link href="/calculator" className="font-mono font-bold text-sm hover:text-primary transition-colors hidden md:block">
            [CALCULATOR]
          </Link>
          <BrutalButton variant="outline" size="sm">Login</BrutalButton>
          <BrutalButton variant="primary" size="sm">Get Started</BrutalButton>
        </div>
      </div>
    </nav>
  );
};
`);

console.log('\\n🎉 Mega-Step 2 complete!');
console.log('\\n📍 New pages created:');
console.log('   • Dashboard: http://localhost:3000/dashboard');
console.log('   • Upload: http://localhost:3000/upload');
console.log('   • Calculator: http://localhost:3000/calculator');
console.log('\\n✨ The Navbar now has navigation links to all pages!');