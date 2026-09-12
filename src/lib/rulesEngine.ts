// Interest Calculator - MSMED Act Section 16
// Calculates penal interest at 3× RBI bank rate

export interface InterestCalculation {
  principal: number;
  startDate: Date;
  endDate: Date;
  rbiRate: number;
}

export function calculatePenalInterest({
  principal,
  startDate,
  endDate,
  rbiRate,
}: InterestCalculation): number {
  // MSMED Act mandates 3× RBI bank rate
  const penalRate = rbiRate * 3;
  
  // Calculate number of days between dates
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Simple interest formula: (P × R × T) / (100 × 365)
  const interest = (principal * penalRate * diffDays) / (100 * 365);
  
  return Math.round(interest * 100) / 100; // Round to 2 decimal places
}

export function calculateEligibility(
  invoiceDate: Date,
  deliveryDate: Date,
  acceptanceDate: Date | null,
  buyerType: string
): {
  eligible: boolean;
  dueDate: Date;
  deemedAcceptanceDate: Date;
  daysOverdue: number;
} {
  // MSMED Act Section 2(b): Deemed acceptance is 30 days after delivery if no explicit acceptance
  const deemedAcceptanceDate = acceptanceDate || new Date(deliveryDate);
  if (!acceptanceDate) {
    deemedAcceptanceDate.setDate(deemedAcceptanceDate.getDate() + 30);
  }
  
  // MSMED Act Section 15: Payment due within 45 days of acceptance
  const dueDate = new Date(deemedAcceptanceDate);
  dueDate.setDate(dueDate.getDate() + 45);
  
  // Check if overdue
  const today = new Date();
  const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Only eligible if overdue and buyer is eligible entity
  const isEligibleBuyer = ['private', 'psu', 'govt'].includes(buyerType.toLowerCase());
  const isOverdue = daysOverdue > 0;
  
  return {
    eligible: isOverdue && isEligibleBuyer,
    dueDate,
    deemedAcceptanceDate,
    daysOverdue: isOverdue ? daysOverdue : 0,
  };
}