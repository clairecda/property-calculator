import type { AustralianState, PropertyCosts, StateBenefits } from '@/types';
import { FALLBACK_BENEFITS } from '@/constants/defaults';
import { calculateMonthlyPayment } from './mortgage';

export function getStateBenefits(
  state: AustralianState,
  isFirstHome: boolean,
  liveBenefits?: Record<AustralianState, StateBenefits>,
): StateBenefits {
  if (!isFirstHome) return { grant: 0, stampDutyConcession: 0 };
  const source = liveBenefits ?? FALLBACK_BENEFITS;
  return source[state] ?? { grant: 0, stampDutyConcession: 0 };
}

export interface PropertyCostsInput {
  propertyName?: string;
  purchasePrice: number;
  stampDuty: number;
  lmi: number;
  state: AustralianState;
  isFirstHome: boolean;
  firstHomeGrant: number;
  stampDutyConcession: number;
  yourDeposit: number;
  partnerDeposit: number;
  interestRate: number;
  loanTerm: number;
  councilRates: number;
  waterRates: number;
  strataFees: number;
  insurance: number;
  maintenancePercent: number;
  legalFees: number;
  inspection: number;
  loanApplication: number;
  valuation: number;
  mortgageReg: number;
  titleFees: number;
  moving: number;
  repairs: number;
}

export function calculatePropertyCosts(input: PropertyCostsInput): PropertyCosts {
  const totalDeposit = input.yourDeposit + input.partnerDeposit;
  const otherUpfront =
    input.legalFees + input.inspection + input.loanApplication + input.valuation +
    input.mortgageReg + input.titleFees + input.moving + input.repairs;

  const grant = input.isFirstHome ? input.firstHomeGrant : 0;
  const concession = input.isFirstHome ? input.stampDutyConcession : 0;

  const baseLoan = Math.max(0, input.purchasePrice - totalDeposit);
  const totalLoan = baseLoan + input.lmi;
  const lvr = input.purchasePrice > 0 ? (totalLoan / input.purchasePrice) * 100 : 0;

  const stampDutyAfter = Math.max(0, input.stampDuty - concession);
  const upfrontCashNeeded = totalDeposit + stampDutyAfter + otherUpfront - grant;

  const monthlyMortgage = calculateMonthlyPayment(totalLoan, input.interestRate, input.loanTerm);
  const monthlyRates = (input.councilRates + input.waterRates) / 12;
  const monthlyStrata = input.strataFees / 12;
  const monthlyInsurance = input.insurance / 12;
  const monthlyMaintenance = (input.purchasePrice * input.maintenancePercent / 100) / 12;

  const totalMonthly = monthlyMortgage + monthlyRates + monthlyStrata + monthlyInsurance + monthlyMaintenance;
  const annualCosts = totalMonthly * 12;

  return {
    propertyName: input.propertyName ?? 'Property',
    state: input.state,
    purchasePrice: input.purchasePrice,
    totalDeposit,
    baseLoan,
    lmi: input.lmi,
    totalLoan,
    lvr,
    firstHomeGrant: grant,
    stampDutyConcession: concession,
    totalBenefits: grant + concession,
    stampDutyBefore: input.stampDuty,
    stampDutyAfter,
    otherUpfront,
    upfrontCashNeeded,
    monthlyMortgage,
    monthlyRates,
    monthlyStrata,
    monthlyInsurance,
    monthlyMaintenance,
    totalMonthly,
    annualCosts,
    interestRate: input.interestRate,
    loanTerm: input.loanTerm,
    maintenancePercent: input.maintenancePercent,
    councilRates: input.councilRates,
    waterRates: input.waterRates,
  };
}
