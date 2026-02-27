import type { PropertyCosts, ScenarioResult } from '@/types';
import { calculateMonthlyPayment } from './mortgage';
import { calculateForecast } from './forecast';

export function calculateScenario(
  base: PropertyCosts,
  priceAdd: number,
  rateAdd: number,
  growth: number,
  rateBump: number,
): ScenarioResult {
  const newPrice = base.purchasePrice + priceAdd;
  const newRate = base.interestRate + rateAdd;
  const loanAmount = newPrice - base.totalDeposit + base.lmi;

  const monthlyPmt = calculateMonthlyPayment(loanAmount, newRate, base.loanTerm);
  const monthlyMaintenance = (newPrice * base.maintenancePercent / 100) / 12;
  const totalMonthly = monthlyPmt + base.monthlyRates + base.monthlyStrata +
    base.monthlyInsurance + monthlyMaintenance;

  // Build a scenario property costs for forecast
  const scenarioCosts: PropertyCosts = {
    ...base,
    purchasePrice: newPrice,
    totalLoan: loanAmount,
    monthlyMortgage: monthlyPmt,
    monthlyMaintenance,
    totalMonthly,
    annualCosts: totalMonthly * 12,
    interestRate: newRate,
    upfrontCashNeeded: base.upfrontCashNeeded + priceAdd, // simplified
  };

  const fc = calculateForecast(scenarioCosts, 30, growth, rateBump);

  return {
    name: '',
    priceAdd,
    rateAdd,
    totalMonthly,
    upfrontCash: scenarioCosts.upfrontCashNeeded,
    netPosition10yr: fc[10]?.netPosition ?? 0,
  };
}

export function calculateCustomScenario(
  base: PropertyCosts,
  priceIncrease: number,
  rateIncrease: number,
  growth: number,
  rateBump: number,
) {
  const newPrice = base.purchasePrice + priceIncrease;

  // Scale stamp duty proportionally
  const scaledStamp = priceIncrease === 0
    ? base.stampDutyBefore
    : (newPrice / base.purchasePrice) * base.stampDutyBefore;

  // If price increases, lose concessions (threshold-based in reality)
  const stampConcession = priceIncrease > 0 ? 0 : base.stampDutyConcession;
  const grantToUse = priceIncrease > 0 ? 0 : base.firstHomeGrant;

  const stampAfterConcession = Math.max(0, scaledStamp - stampConcession);
  const upfrontNeeded = base.totalDeposit + stampAfterConcession + base.otherUpfront - grantToUse;

  const baseLoan = newPrice - base.totalDeposit;
  const totalLoan = baseLoan + base.lmi;
  const newRate = base.interestRate + rateIncrease;

  const monthlyPmt = calculateMonthlyPayment(totalLoan, newRate, base.loanTerm);
  const monthlyMaintenance = (newPrice * base.maintenancePercent / 100) / 12;
  const totalMonthly = monthlyPmt + base.monthlyRates + base.monthlyStrata +
    base.monthlyInsurance + monthlyMaintenance;

  const scenarioCosts: PropertyCosts = {
    ...base,
    purchasePrice: newPrice,
    baseLoan,
    totalLoan,
    lvr: (totalLoan / newPrice) * 100,
    stampDutyBefore: scaledStamp,
    stampDutyAfter: stampAfterConcession,
    stampDutyConcession: stampConcession,
    firstHomeGrant: grantToUse,
    totalBenefits: grantToUse + stampConcession,
    upfrontCashNeeded: upfrontNeeded,
    monthlyMortgage: monthlyPmt,
    monthlyMaintenance,
    totalMonthly,
    annualCosts: totalMonthly * 12,
    interestRate: newRate,
  };

  const baseFc = calculateForecast(base, 30, growth, rateBump);
  const scenarioFc = calculateForecast(scenarioCosts, 30, growth, rateBump);

  return {
    base,
    scenario: scenarioCosts,
    baseForecast: baseFc,
    scenarioForecast: scenarioFc,
    monthlyDiff: scenarioCosts.totalMonthly - base.totalMonthly,
    upfrontDiff: scenarioCosts.upfrontCashNeeded - base.upfrontCashNeeded,
    netPosition10yrDiff: scenarioFc[10].netPosition - baseFc[10].netPosition,
  };
}
