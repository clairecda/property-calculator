import type { TransportMode, CostOfLivingResult, LocationComparisonResult, LocationSummary, PropertyCosts } from '@/types';
import { calculateMonthlyPayment } from './mortgage';

interface CommuteInput {
  distanceKm: number;
  durationMinutes: number;
  daysPerWeek: number;
  mode: TransportMode;
  carCostPerKm: number;
  parkingDaily: number;
  monthlyTransitPass: number;
}

function calculateTransportCost(input: CommuteInput): number {
  const { distanceKm, daysPerWeek, mode, carCostPerKm, parkingDaily, monthlyTransitPass } = input;
  const weeksPerMonth = 52 / 12;

  if (mode === 'drive') {
    const fuelCost = distanceKm * 2 * carCostPerKm * daysPerWeek * weeksPerMonth;
    const parking = parkingDaily * daysPerWeek * weeksPerMonth;
    return fuelCost + parking;
  }

  if (mode === 'transit') {
    return monthlyTransitPass;
  }

  // Mix: 3 days driving + remainder transit
  const driveDays = Math.min(3, daysPerWeek);
  const fuelCost = distanceKm * 2 * carCostPerKm * driveDays * weeksPerMonth;
  const parking = parkingDaily * driveDays * weeksPerMonth;
  return monthlyTransitPass + fuelCost + parking;
}

function calculateCommuteHours(durationMinutes: number, daysPerWeek: number) {
  const dailyMinutes = durationMinutes * 2;
  const weeklyHours = (dailyMinutes * daysPerWeek) / 60;
  const annualHours = weeklyHours * 52;
  return { weeklyHours, annualHours, tenYearHours: annualHours * 10 };
}

export interface CostOfLivingInput {
  // Commute
  commuteDistanceKm: number;
  commuteDurationMinutes: number;
  commuteDaysPerWeek: number;
  transportMode: TransportMode;
  carCostPerKm: number;
  carParkingDaily: number;
  monthlyTransitPass: number;

  // Partner
  hasPartner: boolean;
  partnerCommuteDistanceKm: number;
  partnerCommuteDurationMinutes: number;
  partnerTransportMode: TransportMode;

  // Living expenses
  monthlyGroceries: number;
  monthlyDiningOut: number;
  monthlyUtilities: number;
  monthlyInternet: number;
  monthlySubscriptions: number;
  monthlyHealthInsurance: number;
  monthlyOtherExpenses: number;

  // Property costs (from existing calc)
  totalMonthlyPropertyCost: number;
}

export function calculateCostOfLiving(input: CostOfLivingInput): CostOfLivingResult {
  const monthlyTransportCost = calculateTransportCost({
    distanceKm: input.commuteDistanceKm,
    durationMinutes: input.commuteDurationMinutes,
    daysPerWeek: input.commuteDaysPerWeek,
    mode: input.transportMode,
    carCostPerKm: input.carCostPerKm,
    parkingDaily: input.carParkingDaily,
    monthlyTransitPass: input.monthlyTransitPass,
  });

  let partnerMonthlyTransportCost = 0;
  let partnerAnnualCommuteHours = 0;
  if (input.hasPartner && input.partnerCommuteDistanceKm > 0) {
    partnerMonthlyTransportCost = calculateTransportCost({
      distanceKm: input.partnerCommuteDistanceKm,
      durationMinutes: input.partnerCommuteDurationMinutes,
      daysPerWeek: input.commuteDaysPerWeek,
      mode: input.partnerTransportMode,
      carCostPerKm: input.carCostPerKm,
      parkingDaily: input.carParkingDaily,
      monthlyTransitPass: input.monthlyTransitPass,
    });
    const partnerTime = calculateCommuteHours(input.partnerCommuteDurationMinutes, input.commuteDaysPerWeek);
    partnerAnnualCommuteHours = partnerTime.annualHours;
  }

  const monthlyLivingExpenses =
    input.monthlyGroceries + input.monthlyDiningOut + input.monthlyUtilities +
    input.monthlyInternet + input.monthlySubscriptions + input.monthlyHealthInsurance +
    input.monthlyOtherExpenses;

  const totalTransport = monthlyTransportCost + partnerMonthlyTransportCost;
  const totalMonthlyCostOfLiving = totalTransport + monthlyLivingExpenses;
  const totalMonthlyAllIn = input.totalMonthlyPropertyCost + totalMonthlyCostOfLiving;

  const commuteTime = calculateCommuteHours(input.commuteDurationMinutes, input.commuteDaysPerWeek);

  return {
    dailyCommuteKm: input.commuteDistanceKm * 2,
    dailyCommuteMinutes: input.commuteDurationMinutes * 2,
    weeklyCommuteHours: commuteTime.weeklyHours,
    monthlyTransportCost: totalTransport,
    annualTransportCost: totalTransport * 12,
    monthlyLivingExpenses,
    totalMonthlyCostOfLiving,
    totalMonthlyAllIn,
    annualAllIn: totalMonthlyAllIn * 12,
    tenYearAllIn: totalMonthlyAllIn * 12 * 10,
    annualCommuteHours: commuteTime.annualHours,
    tenYearCommuteHours: commuteTime.tenYearHours,
    partnerMonthlyTransportCost,
    partnerAnnualCommuteHours,
  };
}

export interface LocationComparisonInput {
  // Property A (current)
  labelA: string;
  propertyCostsA: PropertyCosts;
  commuteDistanceKmA: number;
  commuteDurationMinutesA: number;
  commuteDaysPerWeek: number;
  transportMode: TransportMode;
  carCostPerKm: number;
  carParkingDaily: number;
  monthlyTransitPass: number;
  monthlyLivingExpenses: number;

  // Property B (comparison)
  labelB: string;
  comparisonPurchasePrice: number;
  comparisonStampDuty: number;
  commuteDistanceKmB: number;
  commuteDurationMinutesB: number;

  // Shared loan settings for B
  interestRate: number;
  loanTerm: number;
  yourDeposit: number;
  partnerDeposit: number;
  lmi: number;
  monthlyRates: number;
  monthlyStrata: number;
  monthlyInsurance: number;
  maintenancePercent: number;
}

export function calculateLocationComparison(input: LocationComparisonInput): LocationComparisonResult {
  // Property A
  const monthlyPropertyA = input.propertyCostsA.totalMonthly;
  const transportA = calculateTransportCost({
    distanceKm: input.commuteDistanceKmA,
    durationMinutes: input.commuteDurationMinutesA,
    daysPerWeek: input.commuteDaysPerWeek,
    mode: input.transportMode,
    carCostPerKm: input.carCostPerKm,
    parkingDaily: input.carParkingDaily,
    monthlyTransitPass: input.monthlyTransitPass,
  });
  const commuteTimeA = calculateCommuteHours(input.commuteDurationMinutesA, input.commuteDaysPerWeek);

  // Property B — estimate monthly mortgage
  const totalDeposit = input.yourDeposit + input.partnerDeposit;
  const loanB = Math.max(0, input.comparisonPurchasePrice - totalDeposit) + input.lmi;
  const mortgageB = calculateMonthlyPayment(loanB, input.interestRate, input.loanTerm);
  const maintenanceB = (input.comparisonPurchasePrice * input.maintenancePercent / 100) / 12;
  const monthlyPropertyB = mortgageB + input.monthlyRates + input.monthlyStrata + input.monthlyInsurance + maintenanceB;

  const transportB = calculateTransportCost({
    distanceKm: input.commuteDistanceKmB,
    durationMinutes: input.commuteDurationMinutesB,
    daysPerWeek: input.commuteDaysPerWeek,
    mode: input.transportMode,
    carCostPerKm: input.carCostPerKm,
    parkingDaily: input.carParkingDaily,
    monthlyTransitPass: input.monthlyTransitPass,
  });
  const commuteTimeB = calculateCommuteHours(input.commuteDurationMinutesB, input.commuteDaysPerWeek);

  const living = input.monthlyLivingExpenses;

  const propA: LocationSummary = {
    label: input.labelA,
    monthlyProperty: monthlyPropertyA,
    monthlyTransport: transportA,
    monthlyLiving: living,
    monthlyTotal: monthlyPropertyA + transportA + living,
    annualTotal: (monthlyPropertyA + transportA + living) * 12,
    commuteHoursPerYear: commuteTimeA.annualHours,
  };

  const propB: LocationSummary = {
    label: input.labelB,
    monthlyProperty: monthlyPropertyB,
    monthlyTransport: transportB,
    monthlyLiving: living,
    monthlyTotal: monthlyPropertyB + transportB + living,
    annualTotal: (monthlyPropertyB + transportB + living) * 12,
    commuteHoursPerYear: commuteTimeB.annualHours,
  };

  const monthlySavings = propA.monthlyTotal - propB.monthlyTotal;
  const cheaperOption = Math.abs(monthlySavings) < 1 ? 'same' : monthlySavings > 0 ? 'B' : 'A';

  return {
    propertyA: propA,
    propertyB: propB,
    monthlySavings: Math.abs(monthlySavings),
    annualSavings: Math.abs(monthlySavings) * 12,
    tenYearSavings: Math.abs(monthlySavings) * 12 * 10,
    commuteTimeDiffHoursPerYear: propB.commuteHoursPerYear - propA.commuteHoursPerYear,
    cheaperOption,
  };
}
