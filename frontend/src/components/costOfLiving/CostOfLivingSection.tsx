import { useStore } from '@/store/useStore';
import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { useCostOfLiving } from '@/hooks/useCostOfLiving';
import { KpiCard } from '@/components/ui/KpiCard';
import { CommuteInputs } from './CommuteInputs';
import { LivingExpensesInputs } from './LivingExpensesInputs';
import { TimeCostCard } from './TimeCostCard';
import { CostBreakdownChart } from './CostBreakdownChart';
import { LocationComparison } from './LocationComparison';
import { IncomeAffordability } from './IncomeAffordability';
import { formatDollar } from '@/lib/formatters';
import { Wallet, Car, Clock } from 'lucide-react';

export function CostOfLivingSection() {
  const store = useStore();
  const costs = usePropertyCosts();
  const col = useCostOfLiving();

  return (
    <section id="cost-of-living">
      <h2 className="mb-2 text-xl font-bold text-gray-800">Cost of Living</h2>
      <p className="mb-6 text-sm text-gray-500">
        How much it really costs to live here — property, transport, and everyday expenses all together.
      </p>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label="Total monthly (all-in)"
          value={formatDollar(col.totalMonthlyAllIn)}
        />
        <KpiCard
          icon={<Car className="h-4 w-4" />}
          label="Monthly transport cost"
          value={formatDollar(col.monthlyTransportCost)}
          color="amber"
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label="Commute time per week"
          value={`${col.weeklyCommuteHours.toFixed(1)} hrs`}
          hint="* Return trip, home to work"
        />
      </div>

      {/* All sections */}
      <div className="space-y-6">
        <IncomeAffordability />
        <CommuteInputs />
        <LivingExpensesInputs />
        <CostBreakdownChart result={col} monthlyPropertyCost={costs.totalMonthly} />
        <TimeCostCard result={col} hasPartner={store.hasPartner} />
        <LocationComparison />
      </div>
    </section>
  );
}
