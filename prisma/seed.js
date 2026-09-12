const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create an Organization
  const org = await prisma.organization.create({
    data: { name: 'Sharma & Associates', type: 'ca_firm' },
  });

  // Create a Client
  const client = await prisma.client.create({
    data: { name: 'Sharma Industries', managingOrgId: org.id },
  });

  // Create 3 Buyers and Invoices
  const buyers = ['Tata Motors', 'Reliance Industries', 'Infosys Ltd'];
  
  for (let i = 0; i < 3; i++) {
    const buyer = await prisma.buyer.create({
      data: { name: buyers[i], entityType: 'private' },
    });

    await prisma.invoice.create({
      data: {
        clientId: client.id,
        buyerId: buyer.id,
        invoiceNumber: `INV-2026-00${i + 1}`,
        invoiceDate: new Date('2026-08-01'),
        deliveryDate: new Date('2026-08-05'),
        dueDate: new Date('2026-09-15'),
        amount: 450000 + (i * 100000),
        status: 'confirmed',
        extractedByAi: true,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });