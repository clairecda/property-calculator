import { useStore } from '@/store/useStore';
import { useScenarios, useCustomScenario } from '@/hooks/useScenarios';
import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import { formatDollar, formatSignedDollar, formatSignedPercent } from '@/lib/formatters';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

function CustomScenarioPanel() {
  const store = useStore();
  const setField = useStore((s) => s.setField);
  const base = usePropertyCosts();
  const result = useCustomScenario();

  const hasScenario = store.scenarioPriceChange > 0 || store.scenarioRateChange > 0;
  const monthlyDiff = result.monthlyDiff;
  const upfrontDiff = result.upfrontDiff;
  const net10yrDiff = result.netPosition10yrDiff;

  const severity = monthlyDiff > 500 || upfrontDiff > 20000 ? 'danger' : monthlyDiff > 200 ? 'warning' : 'info';

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
        <SlidersHorizontal className="h-4 w-4" /> Build Your Own Scenario
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        Drag the sliders to see what happens if the house costs more or interest rates go up.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          label="House costs more by"
          value={store.scenarioPriceChange}
          min={0}
          max={150000}
          step={10000}
          prefix="$"
          onChange={(v) => setField('scenarioPriceChange', v)}
        />
        <Slider
          label="Interest rate increases by"
          value={store.scenarioRateChange}
          min={0}
          max={3}
          step={0.25}
          suffix="%"
          onChange={(v) => setField('scenarioRateChange', v)}
        />
      </div>

      {hasScenario && (
        <Alert variant={severity} className="mt-4">
          <h4 className="mb-3 font-semibold">What that means for you</h4>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div>
              <div className="text-xs text-gray-500">Monthly repayments</div>
              <div className="text-lg font-bold">{formatDollar(result.scenario.totalMonthly)}</div>
              <div className={cn('text-sm font-medium', monthlyDiff > 0 ? 'text-red-600' : 'text-green-600')}>
                {formatSignedDollar(monthlyDiff)} ({formatSignedPercent((monthlyDiff / base.totalMonthly) * 100)})
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Cash needed on day one</div>
              <div className="text-lg font-bold">{formatDollar(result.scenario.upfrontCashNeeded)}</div>
              <div className={cn('text-sm font-medium', upfrontDiff > 0 ? 'text-red-600' : 'text-green-600')}>
                {formatSignedDollar(upfrontDiff)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Property value minus total spent (10yr)</div>
              <div className="text-lg font-bold">{formatDollar(result.scenarioForecast[10].netPosition)}</div>
              <div className={cn('text-sm font-medium', net10yrDiff < 0 ? 'text-red-600' : 'text-green-600')}>
                {formatSignedDollar(net10yrDiff)}
              </div>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}

function ScenarioTable() {
  const scenarios = useScenarios();
  const current = scenarios.find((s) => s.name === 'Current');
  if (!current) return null;

  const others = scenarios.filter((s) => s.name !== 'Current');

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Current baseline */}
      <div className="border-b border-gray-200 bg-sky-50 px-4 py-4">
        <div className="mb-1 text-xs font-medium text-sky-600">Your current plan</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-gray-500">Monthly repayments</div>
            <div className="text-lg font-bold text-sky-700">{formatDollar(current.totalMonthly)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Cash needed on day one</div>
            <div className="text-lg font-bold text-sky-700">{formatDollar(current.upfrontCash)}</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-gray-500">Property value minus total spent after 10yr</div>
            <div className="text-lg font-bold text-sky-700">
              {current.netPosition10yr >= 0 ? '+' : ''}{formatDollar(current.netPosition10yr)}
            </div>
            <div className="text-xs text-gray-400">
              {current.netPosition10yr >= 0 ? 'Ahead — property worth more than you spent' : 'Behind — spent more than property is worth'}
              {' '}(assumes property value grows each year)
            </div>
          </div>
        </div>
      </div>

      {/* Scenario rows */}
      {others.map((s) => {
        const monthlyDiff = s.totalMonthly - current.totalMonthly;
        const upfrontDiff = s.upfrontCash - current.upfrontCash;
        const netDiff = s.netPosition10yr - current.netPosition10yr;

        return (
          <div key={s.name} className="border-b border-gray-100 px-4 py-4 last:border-b-0">
            <div className="mb-2 text-sm font-semibold text-gray-700">{s.name}</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-xs text-gray-400">Monthly repayments</div>
                <div className="font-semibold text-gray-800">{formatDollar(s.totalMonthly)}</div>
                <div className={cn('text-xs font-medium', monthlyDiff > 0 ? 'text-red-600' : 'text-green-600')}>
                  {formatSignedDollar(monthlyDiff)} more per month
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Cash needed on day one</div>
                <div className="font-semibold text-gray-800">{formatDollar(s.upfrontCash)}</div>
                <div className={cn('text-xs font-medium', upfrontDiff > 0 ? 'text-red-600' : 'text-green-600')}>
                  {formatSignedDollar(upfrontDiff)} more upfront
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs text-gray-400">Property value minus total spent (10yr)</div>
                <div className="font-semibold text-gray-800">{formatDollar(s.netPosition10yr)}</div>
                <div className={cn('text-xs font-medium', netDiff < 0 ? 'text-red-600' : 'text-green-600')}>
                  {netDiff < 0 ? `${formatDollar(Math.abs(netDiff))} worse off` : `${formatDollar(netDiff)} better off`}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RiskSection() {
  return (
    <section id="risk">
      <h2 className="mb-2 text-xl font-bold text-gray-800">What If?</h2>
      <p className="mb-6 text-sm text-gray-500">
        See how your numbers change if the house costs more or interest rates rise.
      </p>

      <CustomScenarioPanel />

      <h3 className="mb-3 font-semibold text-gray-800">Quick Comparisons</h3>
      <p className="mb-4 text-sm text-gray-500">
        Each row shows what would happen compared to your current plan.
        <span className="text-red-600"> Red</span> = costs you more.
      </p>

      <ScenarioTable />
    </section>
  );
}
