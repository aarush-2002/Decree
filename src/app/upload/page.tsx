'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'review' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [extractedData, setExtractedData] = useState({
    amount: '',
    invoiceNumber: '',
    date: '',
    buyerName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await simulateExtraction(file);
    }
  };

  const simulateExtraction = async (file: File) => {
    // 1. Simulate upload
    setStatus('uploading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // 2. Simulate AI extraction
    setStatus('extracting');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 3. Smart mock extraction based on filename
    const extractedData = extractFromFilename(file.name);
    
    // 4. Validate extracted data
    if (!extractedData.amount || !extractedData.invoiceNumber) {
      setStatus('error');
      setErrorMessage('Could not extract invoice details. Please ensure the document contains: Invoice Number, Amount, Date, and Buyer Name.');
      return;
    }
    
    // 5. Show review screen
    setExtractedData(extractedData);
    setStatus('review');
  };

  const extractFromFilename = (filename: string) => {
    // Smart extraction logic based on filename patterns
    const lowerName = filename.toLowerCase();
    
    // Try to extract amount from filename (e.g., "invoice_450000.pdf")
    const amountMatch = filename.match(/(\d{3,})/);
    const amount = amountMatch ? amountMatch[1] : '';
    
    // Try to extract invoice number
    const invoiceMatch = filename.match(/(?:inv|invoice)[-_]?(.+?)(?:\.|_)/i) || filename.match(/(\d+)/);
    const invoiceNumber = invoiceMatch ? invoiceMatch[1] || 'INV-001' : 'INV-001';
    
    // Mock other fields
    const date = new Date().toISOString().split('T')[0];
    const buyerName = lowerName.includes('buyer') ? 'ABC Corporation' : 'Sample Buyer Ltd.';
    
    return {
      amount: amount || '450000',
      invoiceNumber: invoiceNumber,
      date: date,
      buyerName: buyerName,
    };
  };

  const handleConfirm = () => {
    // Redirect to calculator with extracted data
    const interest = calculateInterest(parseFloat(extractedData.amount), 90);
    router.push(`/calculator?amount=${extractedData.amount}&daysOverdue=90&interest=${interest}&invoice=${extractedData.invoiceNumber}`);
  };

  const calculateInterest = (principal: number, days: number) => {
    const rbiRate = 6.5;
    const penalRate = rbiRate * 3; // 19.5%
    const interest = (principal * penalRate * days) / (100 * 365);
    return interest.toFixed(2);
  };

  const handleRetry = () => {
    setStatus('idle');
    setFileName('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-black font-display mb-8 tracking-tight uppercase">
          Upload Invoice
        </h1>

        <div className="border-4 border-gray-600 bg-[#222] p-8 md:p-12">
          {/* IDLE STATE */}
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

          {/* UPLOADING STATE */}
          {status === 'uploading' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-[#ffb020] animate-spin" />
              <h2 className="text-2xl font-black font-display uppercase mb-2">Uploading Securely...</h2>
              <p className="font-mono text-gray-400">Encrypting: {fileName}</p>
            </div>
          )}

          {/* EXTRACTING STATE */}
          {status === 'extracting' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-6 text-[#ffb020] animate-pulse" />
              <h2 className="text-2xl font-black font-display uppercase mb-2">AI Extracting Data...</h2>
              <p className="font-mono text-gray-400 mb-4">Identifying invoice fields...</p>
              <div className="w-64 h-2 bg-gray-700 mx-auto rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb020] animate-[width_2s_ease-in-out_infinite]" style={{width: '70%'}}></div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {status === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
              <h2 className="text-2xl font-black font-display uppercase mb-2 text-red-500">Information Mismatched</h2>
              <p className="font-mono text-gray-400 mb-6 max-w-md mx-auto">{errorMessage}</p>
              <BrutalButton variant="outline" onClick={handleRetry}>
                Try Another Document
              </BrutalButton>
            </div>
          )}

          {/* REVIEW STATE - Let user confirm/correct extracted data */}
          {status === 'review' && (
            <div className="py-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-black font-display uppercase">Extracted Data</h2>
              </div>
              
              <p className="font-mono text-gray-400 mb-6">Review the extracted information. Click "Confirm" to proceed or "Edit" to make corrections.</p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-[#1a1a1a] border-2 border-gray-600 p-4">
                  <label className="block font-mono text-sm text-gray-400 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={extractedData.invoiceNumber}
                    onChange={(e) => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                    className="w-full bg-transparent border-none font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#ffb020]"
                  />
                </div>
                
                <div className="bg-[#1a1a1a] border-2 border-gray-600 p-4">
                  <label className="block font-mono text-sm text-gray-400 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={extractedData.amount}
                    onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})}
                    className="w-full bg-transparent border-none font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#ffb020]"
                  />
                </div>
                
                <div className="bg-[#1a1a1a] border-2 border-gray-600 p-4">
                  <label className="block font-mono text-sm text-gray-400 mb-2">Invoice Date</label>
                  <input
                    type="date"
                    value={extractedData.date}
                    onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                    className="w-full bg-transparent border-none font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#ffb020]"
                  />
                </div>
                
                <div className="bg-[#1a1a1a] border-2 border-gray-600 p-4">
                  <label className="block font-mono text-sm text-gray-400 mb-2">Buyer Name</label>
                  <input
                    type="text"
                    value={extractedData.buyerName}
                    onChange={(e) => setExtractedData({...extractedData, buyerName: e.target.value})}
                    className="w-full bg-transparent border-none font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#ffb020]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <BrutalButton variant="primary" size="xl" onClick={handleConfirm} className="flex-1">
                  Confirm & Calculate Interest
                </BrutalButton>
                <BrutalButton variant="outline" size="xl" onClick={handleRetry} className="flex-1">
                  Cancel
                </BrutalButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
