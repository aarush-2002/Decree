'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { UploadDropzone } from '@/lib/uploadthing';
import { Upload, FileText, Sparkles } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleUploadComplete = async (res: any) => {
    console.log("Files: ", res);
    setUploadUrl(res[0].fileUrl);
    setIsExtracting(true);
    
    // Simulate AI extraction (in real app, call your AI API here)
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedData({
        invoiceNumber: 'INV-2026-001234',
        amount: '450000',
        buyerName: 'Tata Motors Ltd',
        invoiceDate: '2026-08-01',
        deliveryDate: '2026-08-05',
      });
    }, 3000);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch('/api/calculate-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal: parseFloat(extractedData.amount),
          invoiceDate: extractedData.invoiceDate,
          deliveryDate: extractedData.deliveryDate,
          acceptanceDate: null,
          buyerType: 'private',
          rbiRate: 6.5,
        }),
      });

      const data = await response.json();

      if (data.eligible) {
        router.push(`/calculator?amount=${extractedData.amount}&daysOverdue=${data.daysOverdue}&interest=${data.interest}`);
      } else {
        alert('This invoice is not eligible for MSMED Act claim');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to calculate interest');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-5xl font-black font-display mb-8 tracking-tight">UPLOAD INVOICE</h1>
        
        {!uploadUrl ? (
          <BrutalCard className="p-8">
            <div className="text-center mb-6">
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-black uppercase mb-2 font-display">Upload Your Invoice</h2>
              <p className="text-lg font-mono text-gray-600">PDF, JPG, PNG - Max 4MB</p>
            </div>
            
            <div className="border-4 border-black">
              <UploadDropzone
                endpoint="invoiceUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                className="ut-button:bg-primary ut-button:text-base ut-button:border-black ut-button:shadow-brutal ut-allowed-content:text-gray-600"
              />
            </div>
          </BrutalCard>
        ) : isExtracting ? (
          <BrutalCard variant="amber" className="p-12 text-center">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-black uppercase mb-4 font-display">{'>'} AI EXTRACTING DATA...</h2>
            <p className="text-lg font-mono mb-8">Reading invoice details, amounts, dates</p>
            <div className="h-4 bg-gray-200 border-3 border-black">
              <div className="h-full bg-primary animate-pulse w-3/4"></div>
            </div>
          </BrutalCard>
        ) : extractedData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BrutalCard>
              <div className="aspect-[3/4] bg-gray-200 border-3 border-black flex items-center justify-center">
                <FileText className="w-20 h-20 text-gray-400" />
              </div>
            </BrutalCard>
            <BrutalCard variant="amber">
              <h3 className="text-xl font-black uppercase mb-6 font-display border-b-4 border-black pb-2">Extracted Data</h3>
              <div className="space-y-4">
                <BrutalInput 
                  label="Invoice Number" 
                  defaultValue={extractedData.invoiceNumber}
                  onChange={(e) => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                />
                <BrutalInput 
                  label="Amount (₹)" 
                  type="number" 
                  defaultValue={extractedData.amount}
                  onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})}
                />
                <BrutalInput 
                  label="Invoice Date" 
                  type="date" 
                  defaultValue={extractedData.invoiceDate}
                  onChange={(e) => setExtractedData({...extractedData, invoiceDate: e.target.value})}
                />
                <BrutalInput 
                  label="Delivery Date" 
                  type="date" 
                  defaultValue={extractedData.deliveryDate}
                  onChange={(e) => setExtractedData({...extractedData, deliveryDate: e.target.value})}
                />
                <BrutalInput 
                  label="Buyer Name" 
                  defaultValue={extractedData.buyerName}
                  onChange={(e) => setExtractedData({...extractedData, buyerName: e.target.value})}
                />
                <div className="pt-6 flex gap-4">
                  <BrutalButton variant="outline" size="lg" className="flex-1" onClick={() => {setUploadUrl(''); setExtractedData(null);}}>
                    Re-Upload
                  </BrutalButton>
                  <BrutalButton variant="primary" size="lg" className="flex-1" onClick={handleConfirm}>
                    Confirm & Calculate →
                  </BrutalButton>
                </div>
              </div>
            </BrutalCard>
          </div>
        ) : null}
      </div>
    </main>
  );
}