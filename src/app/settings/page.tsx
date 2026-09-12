'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { ArrowLeft, Save, User, Building, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-mono font-bold mb-6 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black font-display mb-8 tracking-tight">SETTINGS</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <BrutalCard variant="amber">
            <div className="flex items-center gap-4 mb-6">
              <User className="w-8 h-8" />
              <h2 className="text-2xl font-black font-display uppercase">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BrutalInput label="Full Name" defaultValue="Anand Sharma" />
              <BrutalInput label="Email Address" defaultValue="anand@sharmaca.com" />
              <BrutalInput label="Phone Number" defaultValue="+91 98765 43210" />
              <BrutalInput label="Role" defaultValue="Chartered Accountant" disabled />
            </div>
          </BrutalCard>

          {/* Organization Section */}
          <BrutalCard variant="teal">
            <div className="flex items-center gap-4 mb-6">
              <Building className="w-8 h-8" />
              <h2 className="text-2xl font-black font-display uppercase">Organization Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BrutalInput label="Firm Name" defaultValue="Sharma & Associates" />
              <BrutalInput label="Udyam Registration No." defaultValue="UDYAM-MH-12-0012345" />
              <BrutalInput label="GSTIN" defaultValue="27AAACT1234C1Z5" />
              <BrutalInput label="Office Address" defaultValue="123, MG Road, Pune" />
            </div>
          </BrutalCard>

          {/* Notifications Section */}
          <BrutalCard variant="default">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="w-8 h-8" />
              <h2 className="text-2xl font-black font-display uppercase">Notifications</h2>
            </div>
            <div className="space-y-4">
              {['Email me when a deadline is approaching', 'Email me when a case status changes', 'Send me weekly summary reports'].map((item) => (
                <label key={item} className="flex items-center justify-between p-4 border-3 border-black hover:bg-gray-50 cursor-pointer">
                  <span className="font-mono font-bold">{item}</span>
                  <input type="checkbox" defaultChecked className="w-6 h-6 border-3 border-black accent-primary" />
                </label>
              ))}
            </div>
          </BrutalCard>

          <BrutalButton variant="primary" size="xl" className="w-full">
            <Save className="w-5 h-5 mr-2" /> Save All Changes
          </BrutalButton>
        </div>
      </div>
    </main>
  );
}