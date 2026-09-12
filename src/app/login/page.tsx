'use client';
import Link from 'next/link';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-4xl font-black font-display tracking-tighter text-white">DECREE</h1>
        </Link>
        
        <BrutalCard className="p-8">
          <h2 className="text-3xl font-black font-display uppercase mb-2 text-center">Welcome Back</h2>
          <p className="text-center font-mono text-sm text-gray-600 mb-8">Sign in to manage your cases</p>
          
          <form className="space-y-4">
            <BrutalInput label="Email Address" type="email" placeholder="you@company.com" />
            <BrutalInput label="Password" type="password" placeholder="••••••••" />
            
            <div className="flex justify-between items-center text-sm font-mono font-bold pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-2 border-black" /> Remember me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>

            <Link href="/dashboard" className="block w-full mt-6">
              <BrutalButton variant="primary" size="lg" className="w-full">
                Sign In <ArrowRight className="ml-2 w-5 h-5" />
              </BrutalButton>
            </Link>
          </form>

          <div className="mt-6 text-center text-sm font-mono">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </div>
        </BrutalCard>
      </div>
    </main>
  );
}