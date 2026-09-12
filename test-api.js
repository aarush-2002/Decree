const test = async () => {
  const response = await fetch('http://localhost:3000/api/calculate-interest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      principal: 450000,
      invoiceDate: '2026-08-01',
      deliveryDate: '2026-08-05',
      acceptanceDate: null,
      buyerType: 'private',
      rbiRate: 6.5,
    }),
  });
  const data = await response.json();
  console.log('API Response:', data);
};

test();
