import { NextRequest, NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/lib/InvoicePDF';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceNumber, clientName, buyerName, amount, interest, total } = body;

    // Generate the PDF buffer
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
    const buffer = await pdfDocument.toBuffer();

    // Return the PDF as a downloadable file
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