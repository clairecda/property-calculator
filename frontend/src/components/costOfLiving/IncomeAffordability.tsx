import { useStore } from '@/store/useStore';
import { useCostOfLiving } from '@/hooks/useCostOfLiving';
import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { NumberInput } from '@/components/ui/NumberInput';
import { formatDollar } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { DollarSign } from 'lucide-react';

interface ColorPair { text: string; bg: string }

const GREEN: ColorPair = { text: 'text-green-600', bg: 'bg-green-600' };
const AMBER: ColorPair = { text: 'text-amber-500', bg: 'bg-amber-500' };
const RED: ColorPair = { text: 'text-red-600', bg: 'bg-red-600' };
const SKY: ColorPair = { text: 'text-sky-500', bg: 'bg-sky-500' };

function AffordabilityBar({ label, amount, percent, color }: {
  label: string;
  amount: number;
  percent: number;
  color: ColorPair;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">
          {formatDollar(amount)}/mo
          <span className={cn('ml-1.5 font-semibold', color.text)}>{percent.toFixed(0)}%</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn('h-full rounded-full transition-all', color.bg)}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function getHousingColor(percent: number): ColorPair {
  if (percent <= 30) return GREEN;
  if (percent <= 40) return AMBER;
  return RED;
}

export function IncomeAffordability() {
  const store = useStore();
  const setField = useStore((s) => s.setField);
  const costs = usePropertyCosts();
  const col = useCostOfLiving();

  const yourMonthly = store.yourAnnualIncome / 12;
  const partnerMonthly = store.hasPartner ? store.partnerAnnualIncome / 12 : 0;
  const totalMonthlyIncome = yourMonthly + partnerMonthly;

  const pctOf = (amount: number) => totalMonthlyIncome > 0 ? (amount / totalMonthlyIncome) * 100 : 0;

  const housingPct = pctOf(costs.totalMonthly);
  const transportPct = pctOf(col.monthlyTransportCost);
  const livingPct = pctOf(col.monthlyLivingExpenses);
  const totalPct = pctOf(col.totalMonthlyAllIn);
  const leftover = totalMonthlyIncome - col.totalMonthlyAllIn;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-1 flex items-center gap-2 font-semibold text-gray-800">
        <DollarSign className="h-4 w-4" /> Income & Affordability
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        What share of your {store.hasPartner ? 'combined ' : ''}take-home pay goes to housing, transport, and living
      </p>

      {/* Income inputs */}
      <div className={cn('grid gap-4 mb-5', store.hasPartner ? 'sm:grid-cols-2' : 'sm:grid-cols-1 max-w-xs')}>
        <NumberInput
          label="Your take-home pay (yearly)"
          value={store.yourAnnualIncome}
          onChange={(v) => setField('yourAnnualIncome', v)}
          step={1000}
        />
        {store.hasPartner && (
          <NumberInput
            label="Partner's take-home pay (yearly)"
            value={store.partnerAnnualIncome}
            onChange={(v) => setField('partnerAnnualIncome', v)}
            step={1000}
          />
        )}
      </div>

      {totalMonthlyIncome > 0 && (
        <>
          {/* Combined income summary */}
          {store.hasPartner && (
            <div className="mb-4 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600">
              Combined take-home: <strong className="text-gray-800">{formatDollar(store.yourAnnualIncome + store.partnerAnnualIncome)}/yr</strong>
              {' '}({formatDollar(totalMonthlyIncome)}/mo)
            </div>
          )}

          {/* Affordability bars */}
          <AffordabilityBar
            label="Housing costs"
            amount={costs.totalMonthly}
            percent={housingPct}
            color={getHousingColor(housingPct)}
          />
          <AffordabilityBar
            label="Transport"
            amount={col.monthlyTransportCost}
            percent={transportPct}
            color={AMBER}
          />
          <AffordabilityBar
            label="Living expenses"
            amount={col.monthlyLivingExpenses}
            percent={livingPct}
            color={SKY}
          />

          {/* Total + leftover */}
          <div className="mt-4 border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Total all-in</span>
              <span className="text-sm font-bold text-gray-800">
                {formatDollar(col.totalMonthlyAllIn)}/mo
                <span className={cn('ml-1.5', getHousingColor(totalPct).text)}>{totalPct.toFixed(0)}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="flex h-full">
                <div className={cn('h-full', getHousingColor(housingPct).bg)} style={{ width: `${Math.min(housingPct, 100)}%` }} />
                <div className="h-full bg-amber-500" style={{ width: `${Math.min(transportPct, 100 - Math.min(housingPct, 100))}%` }} />
                <div className="h-full bg-sky-500" style={{ width: `${Math.min(livingPct, 100 - Math.min(housingPct + transportPct, 100))}%` }} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Left over each month</span>
              <span className={cn('text-lg font-bold', leftover >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatDollar(leftover)}
              </span>
            </div>
          </div>

          {/* Nudge */}
          {housingPct > 30 && (
            <p className={cn(
              'mt-3 rounded px-3 py-2 text-sm',
              housingPct > 40 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700',
            )}>
              {housingPct > 40
                ? `Housing alone takes ${housingPct.toFixed(0)}% of your income — financial advisers generally recommend keeping it under 30%.`
                : `Housing is ${housingPct.toFixed(0)}% of your income — above the 30% guideline. Still manageable, but keep an eye on it.`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
