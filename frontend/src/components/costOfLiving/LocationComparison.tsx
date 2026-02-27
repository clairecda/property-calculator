import { useStore } from '@/store/useStore';
import { useLocationComparison } from '@/hooks/useCostOfLiving';
import { Slider } from '@/components/ui/Slider';
import { NumberInput } from '@/components/ui/NumberInput';
import { formatDollar } from '@/lib/formatters';
import type { LocationSummary } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowLeftRight } from 'lucide-react';

function LocationCard({ loc, highlight }: { loc: LocationSummary; highlight?: boolean }) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      highlight ? 'border-sky-600 bg-sky-50' : 'border-gray-200 bg-white',
    )}>
      <h4 className={cn('mb-3 text-sm font-semibold', highlight ? 'text-sky-700' : 'text-gray-700')}>
        {loc.label}
      </h4>
      <table className="w-full text-sm">
        <tbody>
          {[
            ['Property costs', formatDollar(loc.monthlyProperty)],
            ['Transport', formatDollar(loc.monthlyTransport)],
            ['Living expenses', formatDollar(loc.monthlyLiving)],
          ].map(([label, val]) => (
            <tr key={label} className="border-b border-gray-200 last:border-b-0">
              <td className="py-1.5 text-gray-600">{label}</td>
              <td className="py-1.5 text-right font-medium text-gray-800">{val}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-sky-600">
            <td className="py-2 font-semibold text-gray-800">Total monthly</td>
            <td className="py-2 text-right text-lg font-bold text-sky-600">{formatDollar(loc.monthlyTotal)}</td>
          </tr>
          <tr>
            <td className="py-1 text-gray-500">Commute time/year</td>
            <td className="py-1 text-right text-gray-700">{Math.round(loc.commuteHoursPerYear)} hrs</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function LocationComparison() {
  const store = useStore();
  const setField = useStore((s) => s.setField);
  const comparison = useLocationComparison();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800">
          <ArrowLeftRight className="h-4 w-4" /> Compare Locations
        </h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={store.comparisonEnabled}
            onChange={(e) => setField('comparisonEnabled', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
          />
          Enable
        </label>
      </div>

      {!store.comparisonEnabled && (
        <p className="text-sm text-gray-500">
          Turn this on to compare your property against a second location — see which is truly cheaper when you factor in commute and living costs.
        </p>
      )}

      {store.comparisonEnabled && (
        <div className="space-y-4">
          {/* Comparison property inputs */}
          <div className="rounded border border-gray-100 bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-600">Second property details</h4>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Address / name</label>
              <input
                type="text"
                className="mb-3 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
                placeholder="e.g. 10 Park Ave, Epping"
                value={store.comparisonPropertyAddress}
                onChange={(e) => setField('comparisonPropertyAddress', e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Purchase price"
                value={store.comparisonPurchasePrice}
                onChange={(v) => setField('comparisonPurchasePrice', v)}
                step={10000}
              />
              <NumberInput
                label="Stamp duty"
                value={store.comparisonStampDuty}
                onChange={(v) => setField('comparisonStampDuty', v)}
                step={500}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="One-way distance"
                value={store.comparisonCommuteDistanceKm}
                min={1}
                max={100}
                step={1}
                suffix=" km"
                onChange={(v) => setField('comparisonCommuteDistanceKm', v)}
              />
              <Slider
                label="One-way travel time"
                value={store.comparisonCommuteDurationMinutes}
                min={5}
                max={120}
                step={5}
                suffix=" min"
                onChange={(v) => setField('comparisonCommuteDurationMinutes', v)}
              />
            </div>
          </div>

          {/* Side-by-side comparison */}
          {comparison && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <LocationCard
                  loc={comparison.propertyA}
                  highlight={comparison.cheaperOption === 'A'}
                />
                <LocationCard
                  loc={comparison.propertyB}
                  highlight={comparison.cheaperOption === 'B'}
                />
              </div>

              {/* Verdict */}
              <div className={cn(
                'rounded-lg px-4 py-3 text-sm',
                comparison.cheaperOption === 'same'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-sky-50 text-sky-800',
              )}>
                {comparison.cheaperOption === 'same' ? (
                  <p className="font-medium">Both properties cost about the same all-in.</p>
                ) : (
                  <>
                    <p className="font-semibold">
                      {comparison.cheaperOption === 'A' ? comparison.propertyA.label : comparison.propertyB.label} saves
                      you {formatDollar(comparison.monthlySavings)}/month ({formatDollar(comparison.annualSavings)}/year)
                    </p>
                    {comparison.commuteTimeDiffHoursPerYear !== 0 && (
                      <p className="mt-1">
                        {comparison.commuteTimeDiffHoursPerYear > 0
                          ? `but costs ${Math.round(Math.abs(comparison.commuteTimeDiffHoursPerYear))} more hours commuting per year`
                          : `and saves ${Math.round(Math.abs(comparison.commuteTimeDiffHoursPerYear))} hours commuting per year`}
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
