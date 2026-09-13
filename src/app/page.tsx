import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { FileText, Scale, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-black">
      <Navbar />
      
      {/* Hero Section - Tighter spacing, better font hierarchy */}
      <section className="border-b-4 border-black bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block bg-[#F59E0B] border-2 border-black px-3 py-1 font-mono text-sm font-bold uppercase">
                For Indian MSMEs
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1]">
                GET WHAT'S <br/> <span className="text-[#F59E0B]">OWED. FAST.</span>
              </h1>
              <p className="text-lg md:text-xl font-body text-gray-600 max-w-lg leading-relaxed">
                Turn messy invoices into court-ready claims. We calculate your exact legal interest under the MSMED Act and generate your filing packet in seconds.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/dashboard">
                  <BrutalButton variant="primary" size="xl">
                    Launch Decree <ArrowRight className="ml-2 w-5 h-5" />
                  </BrutalButton>
                </Link>
                <Link href="/upload">
                  <BrutalButton variant="outline" size="xl">
                    Quick Demo
                  </BrutalButton>
                </Link>
              </div>
            </div>

            {/* Added Visual Element to fill empty space */}
            <div className="flex-1 w-full">
              <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000000]">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-black pb-3">
                  <FileText className="w-6 h-6" />
                  <span className="font-mono font-bold">INVOICE_EXTRACTED.pdf</span>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Principal:</span> <span className="font-bold">₹ 4,50,000</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Days Overdue:</span> <span className="font-bold text-red-600">92 Days</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Penal Rate:</span> <span className="font-bold">19.5% (3x RBI)</span></div>
                  <div className="flex justify-between border-t-2 border-black pt-3 mt-3">
                    <span className="font-bold text-lg">Total Claim:</span> 
                    <span className="font-black text-xl text-[#F59E0B]">₹ 5,32,191</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Balanced and filled */}
      <section className="py-16 bg-[#FAFAFA] border-b-4 border-black">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-black font-display mb-10 tracking-tight text-center uppercase">
            How Decree Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "1. Upload Evidence", desc: "Drop any invoice PDF or image. Our engine extracts dates, amounts, and buyer details instantly." },
              { icon: Scale, title: "2. Deterministic Math", desc: "We apply Section 16 of the MSMED Act. No AI hallucinations. Just exact, reproducible legal interest." },
              { icon: Shield, title: "3. Generate Packet", desc: "Download a court-ready PDF containing your evidence, calculations, and statutory notices." },
            ].map((feature, index) => (
              <div key={index} className="bg-white border-2 border-black p-6 hover:-translate-y-1 transition-transform duration-300">
                <feature.icon className="w-10 h-10 text-[#F59E0B] mb-4" />
                <h3 className="text-xl font-black font-display mb-2 uppercase">{feature.title}</h3>
                <p className="text-base font-body text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust/Stats Section - Fills the bottom */}
      <section className="py-16 bg-black text-white border-b-4 border-black">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black font-mono text-[#F59E0B] mb-2">₹10,000Cr+</div>
              <div className="text-sm font-mono uppercase tracking-wider text-gray-400">MSME Capital Blocked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black font-mono text-[#F59E0B] mb-2">45 Days</div>
              <div className="text-sm font-mono uppercase tracking-wider text-gray-400">Legal Payment Window</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black font-mono text-[#F59E0B] mb-2">100%</div>
              <div className="text-sm font-mono uppercase tracking-wider text-gray-400">Statutory Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white">
        <div className="container mx-auto px-6 flex justify-between items-center font-mono text-xs text-gray-500">
          <div className="font-black text-black text-lg">DECREE</div>
          <div>© 2026 Decree. Built for India's MSMEs.</div>
        </div>
      </footer>
    </main>
  );
}
