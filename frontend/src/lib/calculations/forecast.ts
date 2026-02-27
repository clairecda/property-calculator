import type { PropertyCosts, ForecastRow } from '@/types';

export function calculateForecast(
  propertyCosts: PropertyCosts,
  years: number = 30,
  propertyGrowthRate: number = 5.0,
  rateIncreaseYear2: number = 0.5,
): ForecastRow[] {
  const rows: ForecastRow[] = [];

  // Year 0
  rows.push({
    year: 0,
    interestRate: propertyCosts.interestRate,
    propertyValue: propertyCosts.purchasePrice,
    loanBalance: propertyCosts.totalLoan,
    equity: propertyCosts.purchasePrice - propertyCosts.totalLoan,
    principalPaid: 0,
    interestPaid: 0,
    cumulativeCost: propertyCosts.upfrontCashNeeded,
    netPosition: propertyCosts.purchasePrice - propertyCosts.upfrontCashNeeded,
  });

  for (let yearNum = 1; yearNum <= years; yearNum++) {
    const prev = rows[yearNum - 1];
    const rate = yearNum === 1
      ? propertyCosts.interestRate
      : propertyCosts.interestRate + rateIncreaseYear2;

    const propertyValue = prev.propertyValue * (1 + propertyGrowthRate / 100);

    let principalPaid = 0;
    let interestPaid = 0;
    let loanBalance = 0;

    if (prev.loanBalance > 0) {
      const monthlyRate = rate / 100 / 12;
      const remainingMonths = (years - yearNum + 1) * 12;

      let monthlyPmt: number;
      if (monthlyRate === 0) {
        monthlyPmt = prev.loanBalance / remainingMonths;
      } else {
        monthlyPmt = prev.loanBalance *
          (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      }

      const annualInterest = prev.loanBalance * rate / 100;
      const annualPrincipal = Math.min(prev.loanBalance, monthlyPmt * 12 - annualInterest);

      principalPaid = annualPrincipal;
      interestPaid = annualInterest;
      loanBalance = Math.max(0, prev.loanBalance - annualPrincipal);
    }

    const equity = propertyValue - loanBalance;

    const annualCost = principalPaid + interestPaid +
      propertyCosts.annualCosts - (propertyCosts.monthlyMortgage * 12);
    const cumulativeCost = prev.cumulativeCost + annualCost;

    const netPosition = propertyValue - cumulativeCost;

    rows.push({
      year: yearNum,
      interestRate: rate,
      propertyValue,
      loanBalance,
      equity,
      principalPaid,
      interestPaid,
      cumulativeCost,
      netPosition,
    });
  }

  return rows;
}
