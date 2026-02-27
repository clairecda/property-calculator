import type { InputState, AustralianState, StateBenefits } from '@/types';

export const DEFAULT_INPUTS: InputState = {
  state: 'WA',
  isFirstHome: true,
  propertyName: 'My Property',
  purchasePrice: 500000,
  stampDuty: 10500,
  lmi: 0,

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

export const SCENARIOS = [
  { name: 'Current', priceAdd: 0, rateAdd: 0 },
  { name: '+$50K house', priceAdd: 50000, rateAdd: 0 },
  { name: '+$100K house', priceAdd: 100000, rateAdd: 0 },
  { name: '+1% rate', priceAdd: 0, rateAdd: 1 },
  { name: '+2% rate', priceAdd: 0, rateAdd: 2 },
  { name: 'Worst case (+$100K +2%)', priceAdd: 100000, rateAdd: 2 },
];
