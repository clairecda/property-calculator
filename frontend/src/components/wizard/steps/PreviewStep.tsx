import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { KpiCard } from '@/components/ui/KpiCard';
import { formatDollar, formatPercent } from '@/lib/formatters';
import { Banknote, CalendarDays, Percent } from 'lucide-react';

export function PreviewStep() {
  const p = usePropertyCosts();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Here's your snapshot</h2>
        <p className="text-gray-500">Based on what you've entered, here are the key numbers.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Banknote className="h-4 w-4" />}
          label="Cash Needed on Day One"
          value={formatDollar(p.upfrontCashNeeded)}
        />
        <KpiCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Monthly Repayments"
          value={formatDollar(p.totalMonthly)}
        />
        <KpiCard
          icon={<Percent className="h-4 w-4" />}
          label="Loan to Value"
          value={formatPercent(p.lvr)}
          color={p.lvr > 80 ? 'red' : 'sky'}
        />
      </div>

      {p.lvr > 80 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your LVR is above 80%, which usually means you'll need Lenders Mortgage Insurance (LMI). You can add this in the advanced settings later.
        </p>
      )}

      <p className="text-center text-sm text-gray-500">
        You can fine-tune everything later in the sidebar settings.
      </p>
    </div>
  );
}
