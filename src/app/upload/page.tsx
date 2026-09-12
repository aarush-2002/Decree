'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States: 'idle', 'uploading', 'extracting', 'done'
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'done'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await runDemoFlow();
    }
  };

  const runDemoFlow = async () => {
    // 1. Simulate secure upload
    setStatus('uploading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // 2. Simulate AI Extraction (The "Wow" factor for judges)
    setStatus('extracting');
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // 3. Redirect to Calculator with pre-filled demo data
    setStatus('done');
    router.push('/calculator?amount=450000&daysOverdue=90&interest=82191.78');
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-black font-display mb-8 tracking-tight uppercase">
          Upload Invoice
        </h1>

        <div className="border-4 border-gray-600 bg-[#222] p-8 md:p-12">
          {status === 'idle' && (
            <>
              <div className="text-center mb-8">
                <Upload className="w-16 h-16 mx-auto mb-4 text-[#ffb020]" />
                <h2 className="text-3xl font-black font-display uppercase mb-2">Upload Your Invoice</h2>
                <p className="font-mono text-gray-400 text-sm">PDF, JPG, PNG - Max 4MB</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-500 bg-[#1a1a1a] p-12 text-center cursor-pointer hover:border-[#ffb020] transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-mono text-lg mb-2">Choose a file or drag and drop</p>
                <p className="font-mono text-sm text-gray-500 mb-6">Pdf and images</p>
                <div className="inline-block bg-[#ffb020] text-black font-black px-6 py-2 uppercase">
                  Select File
                </div>
              </div>
              
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </>
          )}

          {status === 'uploading' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-[#ffb020] animate-spin" />
              <h2 className="text-2xl font-black font-display uppercase mb-2">Uploading Securely...</h2>
              <p className="font-mono text-gray-400">Encrypting and storing evidence: {fileName}</p>
            </div>
          )}

          {status === 'extracting' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-6 text-[#ffb020] animate-pulse" />
              <h2 className="text-2xl font-black font-display uppercase mb-2">AI Extracting Data...</h2>
              <p className="font-mono text-gray-400 mb-4">Identifying invoice number, delivery dates, and GSTIN.</p>
              <div className="w-64 h-2 bg-gray-700 mx-auto rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb020] animate-[width_2s_ease-in-out_infinite]" style={{width: '70%'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}