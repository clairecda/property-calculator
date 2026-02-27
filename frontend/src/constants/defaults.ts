import type { InputState, AustralianState, StateBenefits } from '@/types';

export const DEFAULT_INPUTS: InputState = {
  state: 'WA',
  isFirstHome: true,
  propertyName: 'My Property',
  purchasePrice: 500000,
  stampDuty: 10500,
  lmi: 0,

  // First home benefits — auto-filled from state data, editable by user
  firstHomeGrant: 10000,
  stampDutyConcession: 19940,

  hasPartner: false,
  yourDeposit: 50000,
  partnerDeposit: 0,

  wizardComplete: false,

  interestRate: 6.15,
  loanTerm: 30,

  councilRates: 1300,
  waterRates: 850,
  strataFees: 0,
  insurance: 950,
  maintenancePercent: 1.0,

  legalFees: 2000,
  inspection: 600,
  loanApplication: 600,
  valuation: 300,
  mortgageReg: 165,
  titleFees: 250,
  moving: 1500,
  repairs: 5000,

  propertyGrowthRate: 5.0,
  rateIncreaseYear2: 0.5,

  scenarioPriceChange: 0,
  scenarioRateChange: 0,
  scenarioGrowthChange: 0,

  // Cost of Living — Income (after tax)
  yourAnnualIncome: 57000,
  partnerAnnualIncome: 0,

  // Cost of Living — Commute
  workAddress: '',
  propertyAddress: '',
  commuteDistanceKm: 15,
  commuteDurationMinutes: 30,
  commuteDaysPerWeek: 5,
  transportMode: 'drive',
  carCostPerKm: 0.85,
  carParkingDaily: 0,
  monthlyTransitPass: 170,

  // Cost of Living — Partner commute
  partnerWorkAddress: '',
  partnerCommuteDistanceKm: 0,
  partnerCommuteDurationMinutes: 0,
  partnerTransportMode: 'drive',

  // Cost of Living — Monthly expenses
  monthlyGroceries: 600,
  monthlyDiningOut: 200,
  monthlyUtilities: 300,
  monthlyInternet: 80,
  monthlySubscriptions: 50,
  monthlyHealthInsurance: 200,
  monthlyOtherExpenses: 100,

  // Cost of Living — Location comparison
  comparisonEnabled: false,
  comparisonPropertyAddress: '',
  comparisonCommuteDistanceKm: 20,
  comparisonCommuteDurationMinutes: 45,
  comparisonPurchasePrice: 550000,
  comparisonStampDuty: 12000,
};

export const STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export const FALLBACK_BENEFITS: Record<AustralianState, StateBenefits> = {
  NSW: { grant: 0, stampDutyConcession: 37800 },
  VIC: { grant: 10000, stampDutyConcession: 31070 },
  QLD: { grant: 30000, stampDutyConcession: 8750 },
  WA:  { grant: 10000, stampDutyConcession: 19940 },
  SA:  { grant: 15000, stampDutyConcession: 21330 },
  TAS: { grant: 30000, stampDutyConcession: 20240 },
  ACT: { grant: 0, stampDutyConcession: 25400 },
  NT:  { grant: 10000, stampDutyConcession: 23928 },
};

export const MILESTONE_YEARS = [1, 5, 10, 15, 20, 25, 30];
export const CHART_KEY_YEARS = [10, 20, 30];

export const SCENARIOS: { name: string; priceAdd: number; rateAdd: number; growthOverride?: number }[] = [
  { name: 'Current', priceAdd: 0, rateAdd: 0 },
  { name: '+$50K house', priceAdd: 50000, rateAdd: 0 },
  { name: '+$100K house', priceAdd: 100000, rateAdd: 0 },
  { name: '+1% rate', priceAdd: 0, rateAdd: 1 },
  { name: '+2% rate', priceAdd: 0, rateAdd: 2 },
  { name: 'No growth (flat market)', priceAdd: 0, rateAdd: 0, growthOverride: 0 },
  { name: 'Value drops 2%/yr', priceAdd: 0, rateAdd: 0, growthOverride: -2 },
  { name: 'Value drops 5%/yr', priceAdd: 0, rateAdd: 0, growthOverride: -5 },
  { name: 'Worst case (+$100K +2%)', priceAdd: 100000, rateAdd: 2 },
];
