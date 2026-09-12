import { NextRequest, NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/lib/InvoicePDF';

// Force Node.js runtime (required for PDF generation on Vercel)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceNumber, clientName, buyerName, amount, interest, total } = body;

    const pdfDocument = pdf(
      <InvoicePDF 
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        buyerName={buyerName}
        amount={amount}
        interest={interest}
        total={total}
      />
    );
    
    // Get the buffer and ensure it's typed correctly for NextResponse
    const buffer = await pdfDocument.toBuffer() as unknown as Buffer;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Filing_Packet_${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}