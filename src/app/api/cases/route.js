import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all invoices from the database
    const invoices = await prisma.invoice.findMany({
      include: {
        buyer: true,
        client: true,
        case: true,
      },
      orderBy: {
        invoiceDate: 'desc',
      },
    });

    // Map the database data to the format our frontend table expects
    const cases = invoices.map((inv) => ({
      id: inv.invoiceNumber,
      client: inv.client?.name || 'Unknown Client',
      buyer: inv.buyer?.name || 'Unknown Buyer',
      amount: inv.amount,
      status: inv.case?.state || 'filed', // Default to 'filed' if no case exists yet
      daysOverdue: 120, // We will calculate this dynamically later
    }));

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}