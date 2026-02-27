import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculatePropertyCosts } from '@/lib/calculations';

export function usePropertyCosts() {
  const store = useStore();

  return useMemo(() => {
    return calculatePropertyCosts({
      propertyName: store.propertyName,
      purchasePrice: store.purchasePrice,
      stampDuty: store.stampDuty,
      lmi: store.lmi,
      state: store.state,
      isFirstHome: store.isFirstHome,
      firstHomeGrant: store.firstHomeGrant,
      stampDutyConcession: store.stampDutyConcession,
      yourDeposit: store.yourDeposit,
      partnerDeposit: store.partnerDeposit,
      interestRate: store.interestRate,
      loanTerm: store.loanTerm,
      councilRates: store.councilRates,
      waterRates: store.waterRates,
      strataFees: store.strataFees,
      insurance: store.insurance,
      maintenancePercent: store.maintenancePercent,
      legalFees: store.legalFees,
      inspection: store.inspection,
      loanApplication: store.loanApplication,
      valuation: store.valuation,
      mortgageReg: store.mortgageReg,
      titleFees: store.titleFees,
      moving: store.moving,
      repairs: store.repairs,
    });
  }, [
    store.propertyName, store.purchasePrice, store.stampDuty, store.lmi,
    store.state, store.isFirstHome, store.firstHomeGrant, store.stampDutyConcession,
    store.yourDeposit, store.partnerDeposit,
    store.interestRate, store.loanTerm, store.councilRates, store.waterRates,
    store.strataFees, store.insurance, store.maintenancePercent,
    store.legalFees, store.inspection, store.loanApplication, store.valuation,
    store.mortgageReg, store.titleFees, store.moving, store.repairs,
  ]);
}
