import { NextRequest, NextResponse } from 'next/server';
import { calculatePenalInterest, calculateEligibility } from '@/lib/rulesEngine';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Safety check for Prisma
    if (!prisma) {
      console.error('Prisma client not initialized - missing DATABASE_URL');
      return NextResponse.json(
        { error: 'Database not configured' }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      principal,
      invoiceDate,
      deliveryDate,
      buyerType,
      rbiRate = 6.5,
    } = body;

    // 1. Check eligibility
    const eligibility = calculateEligibility(
      new Date(invoiceDate),
      new Date(deliveryDate),
      null,
      buyerType
    );

    if (!eligibility.eligible) {
      return NextResponse.json({ eligible: false, message: 'Not eligible' });
    }

    // 2. Calculate interest
    const interest = calculatePenalInterest({
      principal: parseFloat(principal),
      startDate: eligibility.dueDate,
      endDate: new Date(),
      rbiRate,
    });

    // 3. SAVE TO DATABASE (The Magic Moment!)
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        amount: parseFloat(principal),
        invoiceDate: new Date(invoiceDate),
        deliveryDate: new Date(deliveryDate),
        dueDate: eligibility.dueDate,
        status: 'confirmed',
        extractedByAi: true,
        // Create a dummy buyer and client for now
        buyer: {
          create: { name: 'Mock Buyer', entityType: buyerType }
        },
        client: {
          create: { 
            name: 'Mock Client', 
            managingOrg: { create: { name: 'Default Org', type: 'msme' } } 
          } 
        }
      }
    });

    console.log("✅ Saved to database! Invoice ID:", newInvoice.id);

    return NextResponse.json({
      eligible: true,
      invoiceId: newInvoice.id,
      principal: parseFloat(principal),
      interest,
      total: parseFloat(principal) + interest,
      daysOverdue: eligibility.daysOverdue,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}