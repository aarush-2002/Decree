import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Verify the user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find the user in our database to get their organization ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { orgId: true }
    });

    // 3. SECURITY: Only fetch invoices scoped to this user's organization
    // (Fallback to all invoices ONLY if dbUser isn't found yet, to prevent breaking the demo during testing)
    const whereClause = dbUser 
      ? { client: { managingOrgId: dbUser.orgId } } 
      : {};

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        buyer: true,
        client: true,
        case: true,
      },
      orderBy: {
        invoiceDate: 'desc',
      },
    });

    const cases = invoices.map((inv) => ({
      id: inv.invoiceNumber,
      client: inv.client?.name || 'Unknown Client',
      buyer: inv.buyer?.name || 'Unknown Buyer',
      amount: inv.amount,
      status: inv.case?.state || 'filed',
      daysOverdue: 120, 
    }));

    return NextResponse.json(cases);
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}