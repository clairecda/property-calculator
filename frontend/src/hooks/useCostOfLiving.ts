import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { usePropertyCosts } from './usePropertyCosts';
import { calculateCostOfLiving, calculateLocationComparison } from '@/lib/calculations';
import type { CostOfLivingResult, LocationComparisonResult } from '@/types';

export function useCostOfLiving(): CostOfLivingResult {
  const store = useStore();
  const costs = usePropertyCosts();

  return useMemo(() => {
    return calculateCostOfLiving({
      commuteDistanceKm: store.commuteDistanceKm,
      commuteDurationMinutes: store.commuteDurationMinutes,
      commuteDaysPerWeek: store.commuteDaysPerWeek,
      transportMode: store.transportMode,
      carCostPerKm: store.carCostPerKm,
      carParkingDaily: store.carParkingDaily,
      monthlyTransitPass: store.monthlyTransitPass,
      hasPartner: store.hasPartner,
      partnerCommuteDistanceKm: store.partnerCommuteDistanceKm,
      partnerCommuteDurationMinutes: store.partnerCommuteDurationMinutes,
      partnerTransportMode: store.partnerTransportMode,
      monthlyGroceries: store.monthlyGroceries,
      monthlyDiningOut: store.monthlyDiningOut,
      monthlyUtilities: store.monthlyUtilities,
      monthlyInternet: store.monthlyInternet,
      monthlySubscriptions: store.monthlySubscriptions,
      monthlyHealthInsurance: store.monthlyHealthInsurance,
      monthlyOtherExpenses: store.monthlyOtherExpenses,
      totalMonthlyPropertyCost: costs.totalMonthly,
    });
  }, [
    store.commuteDistanceKm, store.commuteDurationMinutes, store.commuteDaysPerWeek,
    store.transportMode, store.carCostPerKm, store.carParkingDaily, store.monthlyTransitPass,
    store.hasPartner, store.partnerCommuteDistanceKm, store.partnerCommuteDurationMinutes,
    store.partnerTransportMode, store.monthlyGroceries, store.monthlyDiningOut,
    store.monthlyUtilities, store.monthlyInternet, store.monthlySubscriptions,
    store.monthlyHealthInsurance, store.monthlyOtherExpenses, costs.totalMonthly,
  ]);
}

export function useLocationComparison(): LocationComparisonResult | null {
  const store = useStore();
  const costs = usePropertyCosts();
  const col = useCostOfLiving();

  return useMemo(() => {
    if (!store.comparisonEnabled) return null;

    return calculateLocationComparison({
      labelA: store.propertyName || 'Property A',
      propertyCostsA: costs,
      commuteDistanceKmA: store.commuteDistanceKm,
      commuteDurationMinutesA: store.commuteDurationMinutes,
      commuteDaysPerWeek: store.commuteDaysPerWeek,
      transportMode: store.transportMode,
      carCostPerKm: store.carCostPerKm,
      carParkingDaily: store.carParkingDaily,
      monthlyTransitPass: store.monthlyTransitPass,
      monthlyLivingExpenses: col.monthlyLivingExpenses,
      labelB: store.comparisonPropertyAddress || 'Property B',
      comparisonPurchasePrice: store.comparisonPurchasePrice,
      comparisonStampDuty: store.comparisonStampDuty,
      commuteDistanceKmB: store.comparisonCommuteDistanceKm,
      commuteDurationMinutesB: store.comparisonCommuteDurationMinutes,
      interestRate: store.interestRate,
      loanTerm: store.loanTerm,
      yourDeposit: store.yourDeposit,
      partnerDeposit: store.partnerDeposit,
      lmi: store.lmi,
      monthlyRates: costs.monthlyRates,
      monthlyStrata: costs.monthlyStrata,
      monthlyInsurance: costs.monthlyInsurance,
      maintenancePercent: store.maintenancePercent,
    });
  }, [
    store.comparisonEnabled, store.propertyName, costs, store.commuteDistanceKm,
    store.commuteDurationMinutes, store.commuteDaysPerWeek, store.transportMode,
    store.carCostPerKm, store.carParkingDaily, store.monthlyTransitPass,
    col.monthlyLivingExpenses, store.comparisonPropertyAddress,
    store.comparisonPurchasePrice, store.comparisonStampDuty,
    store.comparisonCommuteDistanceKm, store.comparisonCommuteDurationMinutes,
    store.interestRate, store.loanTerm, store.yourDeposit, store.partnerDeposit,
    store.lmi, store.maintenancePercent,
  ]);
}
