'use client';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { ArrowRight } from 'lucide-react';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-4xl font-black font-display tracking-tighter text-white">DECREE</h1>
        </Link>
        
        <BrutalCard className="p-8">
          <h2 className="text-3xl font-black font-display uppercase mb-2 text-center">Create Account</h2>
          <p className="text-center font-mono text-sm text-gray-600 mb-8">Start recovering your dues today</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <BrutalInput label="First Name" placeholder="John" />
              <BrutalInput label="Last Name" placeholder="Doe" />
            </div>
            <BrutalInput label="Work Email" type="email" placeholder="you@company.com" />
            <BrutalInput label="Password" type="password" placeholder="Create a strong password" />
            
            <div>
              <label className="block font-mono font-bold uppercase mb-2 text-sm">I am a...</label>
              <select className="brutal-input w-full bg-white">
                <option>MSME Owner</option>
                <option>CA / Consultant</option>
                <option>Association Coordinator</option>
              </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input type="checkbox" className="w-5 h-5 border-3 border-black mt-1" />
              <span className="text-sm font-mono">I agree to the Terms of Service and Privacy Policy. Decree provides document assembly, not legal advice.</span>
            </label>

            <Link href="/dashboard" className="block w-full mt-6">
              <BrutalButton variant="primary" size="lg" className="w-full">
                Create Account <ArrowRight className="ml-2 w-5 h-5" />
              </BrutalButton>
            </Link>
          </form>

          <div className="mt-6 text-center text-sm font-mono">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </div>
        </BrutalCard>
      </div>
    </main>
  );
}