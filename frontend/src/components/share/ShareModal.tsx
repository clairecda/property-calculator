import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { useForecast } from '@/hooks/useForecast';
import { useScenarios } from '@/hooks/useScenarios';
import { useCostOfLiving } from '@/hooks/useCostOfLiving';
import { useStore } from '@/store/useStore';
import { generatePdf } from '@/lib/generatePdf';
import type { InputState } from '@/types';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ open, onClose }: ShareModalProps) {
  const [downloading, setDownloading] = useState(false);
  const costs = usePropertyCosts();
  const forecast = useForecast();
  const scenarios = useScenarios();
  const costOfLiving = useCostOfLiving();
  const store = useStore();

  const inputs: InputState = {
    state: store.state,
    isFirstHome: store.isFirstHome,
    propertyName: store.propertyName,
    purchasePrice: store.purchasePrice,
    stampDuty: store.stampDuty,
    lmi: store.lmi,
    firstHomeGrant: store.firstHomeGrant,
    stampDutyConcession: store.stampDutyConcession,
    hasPartner: store.hasPartner,
    yourDeposit: store.yourDeposit,
    partnerDeposit: store.partnerDeposit,
    wizardComplete: store.wizardComplete,
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
    propertyGrowthRate: store.propertyGrowthRate,
    rateIncreaseYear2: store.rateIncreaseYear2,
    scenarioPriceChange: store.scenarioPriceChange,
    scenarioRateChange: store.scenarioRateChange,
    scenarioGrowthChange: store.scenarioGrowthChange,
    yourAnnualIncome: store.yourAnnualIncome,
    partnerAnnualIncome: store.partnerAnnualIncome,
    workAddress: store.workAddress,
    propertyAddress: store.propertyAddress,
    commuteDistanceKm: store.commuteDistanceKm,
    commuteDurationMinutes: store.commuteDurationMinutes,
    commuteDaysPerWeek: store.commuteDaysPerWeek,
    transportMode: store.transportMode,
    carCostPerKm: store.carCostPerKm,
    carParkingDaily: store.carParkingDaily,
    monthlyTransitPass: store.monthlyTransitPass,
    partnerWorkAddress: store.partnerWorkAddress,
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
    comparisonEnabled: store.comparisonEnabled,
    comparisonPropertyAddress: store.comparisonPropertyAddress,
    comparisonCommuteDistanceKm: store.comparisonCommuteDistanceKm,
    comparisonCommuteDurationMinutes: store.comparisonCommuteDurationMinutes,
    comparisonPurchasePrice: store.comparisonPurchasePrice,
    comparisonStampDuty: store.comparisonStampDuty,
  };

  if (!open) return null;

  function handleDownload() {
    setDownloading(true);
    try {
      const doc = generatePdf({ costs, forecast, scenarios, inputs, costOfLiving });
      const filename = `property-report-${costs.propertyName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      doc.save(filename);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">Share Report</h2>
            <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6 px-6 py-5">
            {/* Download PDF */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Download PDF</h3>
              <p className="mb-3 text-xs text-gray-500">
                Get a nicely formatted report with all your numbers, forecasts, and scenarios.
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-3">
            <p className="text-center text-xs text-gray-400">
              Built by Claire Boulange
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
