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
// Force Vercel rebuild
