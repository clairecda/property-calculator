import type { CostOfLivingResult } from '@/types';
import { Clock } from 'lucide-react';

interface TimeCostCardProps {
  result: CostOfLivingResult;
  hasPartner: boolean;
}

export function TimeCostCard({ result, hasPartner }: TimeCostCardProps) {
  const annualDays = Math.round(result.annualCommuteHours / 24);
  const tenYearDays = Math.round(result.tenYearCommuteHours / 24);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
        <Clock className="h-4 w-4" /> Time Cost of Commuting
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded bg-gray-50 p-3 text-center">
          <div className="text-xs text-gray-500">Weekly commute</div>
          <div className="text-xl font-bold text-gray-800">{result.weeklyCommuteHours.toFixed(1)} hrs</div>
        </div>
        <div className="rounded bg-gray-50 p-3 text-center">
          <div className="text-xs text-gray-500">Annual commute</div>
          <div className="text-xl font-bold text-gray-800">{Math.round(result.annualCommuteHours)} hrs</div>
          <div className="text-xs text-gray-400">~{annualDays} full days</div>
        </div>
        <div className="rounded bg-gray-50 p-3 text-center">
          <div className="text-xs text-gray-500">Over 10 years</div>
          <div className="text-xl font-bold text-gray-800">{Math.round(result.tenYearCommuteHours).toLocaleString()} hrs</div>
          <div className="text-xs text-gray-400">~{tenYearDays} full days</div>
        </div>
      </div>

      <p className="mt-4 rounded bg-amber-50 px-3 py-2 text-sm text-amber-800">
        That's like spending <strong>{annualDays} full days</strong> per year just commuting
        {annualDays > 20 && ' — more than your annual leave!'}
      </p>

      {hasPartner && result.partnerAnnualCommuteHours > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Partner's commute adds another {Math.round(result.partnerAnnualCommuteHours)} hours per year
        </p>
      )}
    </div>
  );
}
