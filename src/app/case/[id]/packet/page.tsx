'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { ArrowLeft, Download, Mail, ExternalLink } from 'lucide-react';

export default function PacketPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-8 flex-1 flex flex-col">
        <Link href="/case/CASE-001" className="inline-flex items-center text-sm font-mono font-bold mb-6 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Case
        </Link>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black font-display tracking-tight">FILING PACKET PREVIEW</h1>
          <div className="flex gap-4">
            <BrutalButton variant="outline" size="md"><Download className="w-4 h-4 mr-2" /> Download PDF</BrutalButton>
            <BrutalButton variant="secondary" size="md"><Mail className="w-4 h-4 mr-2" /> Email to Client</BrutalButton>
          </div>
        </div>

        {/* Mock PDF Viewer */}
        <div className="flex-1 bg-white border-4 border-black shadow-brutal p-8 overflow-y-auto max-h-[70vh]">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center border-b-4 border-black pb-8">
              <h2 className="text-3xl font-black font-display mb-2">BEFORE THE MICRO AND SMALL ENTERPRISE FACILITATION COUNCIL</h2>
              <p className="text-xl font-mono">Application under Section 18 of the MSMED Act, 2006</p>
            </div>
            
            <div>
              <h3 className="text-xl font-black font-display uppercase mb-4 border-b-2 border-black pb-2">1. Applicant Details</h3>
              <p className="font-mono text-lg leading-relaxed">
                <strong>Name:</strong> Sharma Industries<br/>
                <strong>Udyam Registration:</strong> UDYAM-MH-12-0012345<br/>
                <strong>Address:</strong> 123 Industrial Area, Pune, Maharashtra
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black font-display uppercase mb-4 border-b-2 border-black pb-2">2. Respondent Details</h3>
              <p className="font-mono text-lg leading-relaxed">
                <strong>Name:</strong> Tata Motors Ltd<br/>
                <strong>GSTIN:</strong> 27AAACT1234C1Z5
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black font-display uppercase mb-4 border-b-2 border-black pb-2">3. Claim Summary</h3>
              <p className="font-mono text-lg leading-relaxed">
                The applicant supplied goods worth <strong>Rs. 4,50,000</strong> on August 1, 2026. 
                As per the MSMED Act, payment was due within 45 days (by September 15, 2026). 
                The respondent has failed to make the payment, resulting in a delay of 90 days.
                <br/><br/>
                <strong>Principal Amount:</strong> Rs. 4,50,000<br/>
                <strong>Penal Interest (3x RBI Rate @ 19.5% p.a.):</strong> Rs. 82,191<br/>
                <strong>Total Claim:</strong> Rs. 5,32,191
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="mt-8 bg-white border-4 border-black p-6 shadow-brutal flex justify-between items-center">
          <div className="font-mono font-bold">Ready to file on SAMADHAAN Portal?</div>
          <BrutalButton variant="primary" size="lg">
            Proceed to SAMADHAAN <ExternalLink className="ml-2 w-5 h-5" />
          </BrutalButton>
        </div>
      </div>
    </main>
  );
}