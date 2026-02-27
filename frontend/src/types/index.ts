export interface StateBenefits {
  grant: number;
  stampDutyConcession: number;
}

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface PropertyCosts {
  propertyName: string;
  state: AustralianState;
  purchasePrice: number;

  totalDeposit: number;
  baseLoan: number;
  lmi: number;
  totalLoan: number;
  lvr: number;

  firstHomeGrant: number;
  stampDutyConcession: number;
  totalBenefits: number;

  stampDutyBefore: number;
  stampDutyAfter: number;
  otherUpfront: number;
  upfrontCashNeeded: number;

  monthlyMortgage: number;
  monthlyRates: number;
  monthlyStrata: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  totalMonthly: number;

  annualCosts: number;
  interestRate: number;
  loanTerm: number;
  maintenancePercent: number;
  councilRates: number;
  waterRates: number;
}

export interface ForecastRow {
  year: number;
  interestRate: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  principalPaid: number;
  interestPaid: number;
  cumulativeCost: number;
  netPosition: number;
}

export interface ScenarioResult {
  name: string;
  priceAdd: number;
  rateAdd: number;
  totalMonthly: number;
  upfrontCash: number;
  netPosition10yr: number;
}

export interface InputState {
  // Property
  state: AustralianState;
  isFirstHome: boolean;
  propertyName: string;
  purchasePrice: number;
  stampDuty: number;
  lmi: number;

  // Deposits
  hasPartner: boolean;
  yourDeposit: number;
  partnerDeposit: number;

  // Wizard
  wizardComplete: boolean;

  // Loan
  interestRate: number;
  loanTerm: number;

  // Ongoing costs (annual)
  councilRates: number;
  waterRates: number;
  strataFees: number;
  insurance: number;
  maintenancePercent: number;

  // Other upfront
  legalFees: number;
  inspection: number;
  loanApplication: number;
  valuation: number;
  mortgageReg: number;
  titleFees: number;
  moving: number;
  repairs: number;

  // Forecast
  propertyGrowthRate: number;
  rateIncreaseYear2: number;

  // Scenario
  scenarioPriceChange: number;
  scenarioRateChange: number;
  scenarioGrowthChange: number;

  // Cost of Living — Income
  yourAnnualIncome: number;
  partnerAnnualIncome: number;

  // Cost of Living — Commute
  workAddress: string;
  propertyAddress: string;
  commuteDistanceKm: number;
  commuteDurationMinutes: number;
  commuteDaysPerWeek: number;
  transportMode: TransportMode;
  carCostPerKm: number;
  carParkingDaily: number;
  monthlyTransitPass: number;

  // Cost of Living — Partner commute
  partnerWorkAddress: string;
  partnerCommuteDistanceKm: number;
  partnerCommuteDurationMinutes: number;
  partnerTransportMode: TransportMode;

  // Cost of Living — Monthly expenses
  monthlyGroceries: number;
  monthlyDiningOut: number;
  monthlyUtilities: number;
  monthlyInternet: number;
  monthlySubscriptions: number;
  monthlyHealthInsurance: number;
  monthlyOtherExpenses: number;

  // Cost of Living — Location comparison
  comparisonEnabled: boolean;
  comparisonPropertyAddress: string;
  comparisonCommuteDistanceKm: number;
  comparisonCommuteDurationMinutes: number;
  comparisonPurchasePrice: number;
  comparisonStampDuty: number;
}

export type BenefitsSource = 'live' | 'cached' | 'default';

export type TransportMode = 'drive' | 'transit' | 'mix';

export interface CostOfLivingResult {
  dailyCommuteKm: number;
  dailyCommuteMinutes: number;
  weeklyCommuteHours: number;
  monthlyTransportCost: number;
  annualTransportCost: number;
  monthlyLivingExpenses: number;
  totalMonthlyCostOfLiving: number;
  totalMonthlyAllIn: number;
  annualAllIn: number;
  tenYearAllIn: number;
  annualCommuteHours: number;
  tenYearCommuteHours: number;
  partnerMonthlyTransportCost: number;
  partnerAnnualCommuteHours: number;
}

export interface LocationComparisonResult {
  propertyA: LocationSummary;
  propertyB: LocationSummary;
  monthlySavings: number;
  annualSavings: number;
  tenYearSavings: number;
  commuteTimeDiffHoursPerYear: number;
  cheaperOption: 'A' | 'B' | 'same';
}

export interface LocationSummary {
  label: string;
  monthlyProperty: number;
  monthlyTransport: number;
  monthlyLiving: number;
  monthlyTotal: number;
  annualTotal: number;
  commuteHoursPerYear: number;
}
