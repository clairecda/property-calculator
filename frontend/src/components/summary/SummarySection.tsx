import { usePropertyCosts } from '@/hooks/usePropertyCosts';
import { KpiCard } from '@/components/ui/KpiCard';
import { formatDollar, formatPercent } from '@/lib/formatters';
import { Banknote, CalendarDays, Percent } from 'lucide-react';

export function SummarySection() {
  const p = usePropertyCosts();

  return (
    <section id="summary">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Summary</h2>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
        />
      </div>

      {/* Detail Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-500">Property & Loan</h3>
          <table className="w-full text-sm">
            <tbody>
              {[
                ['State', p.state],
                ['Purchase price', formatDollar(p.purchasePrice)],
                ['Total deposit', formatDollar(p.totalDeposit)],
                ['Loan amount', formatDollar(p.totalLoan)],
                ['LMI', formatDollar(p.lmi)],
                ['First home grant', formatDollar(p.firstHomeGrant)],
                ['Stamp duty concession', formatDollar(p.stampDutyConcession)],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-2 text-gray-600">{label}</td>
                  <td className="py-2 text-right font-medium text-gray-800">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-500">Costs Breakdown</h3>
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Mortgage (P&I)', formatDollar(p.monthlyMortgage)],
                ['Rates & utilities', formatDollar(p.monthlyRates)],
                ['Strata', formatDollar(p.monthlyStrata)],
                ['Insurance', formatDollar(p.monthlyInsurance)],
                ['Maintenance (est)', formatDollar(p.monthlyMaintenance)],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-2 text-gray-600">{label}</td>
                  <td className="py-2 text-right font-medium text-gray-800">{val}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-sky-600">
                <td className="py-2 font-semibold text-gray-800">Total monthly</td>
                <td className="py-2 text-right font-bold text-sky-600">{formatDollar(p.totalMonthly)}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Cash needed on day one</td>
                <td className="py-2 text-right font-medium text-gray-800">{formatDollar(p.upfrontCashNeeded)}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Total annual</td>
                <td className="py-2 text-right font-medium text-gray-800">{formatDollar(p.annualCosts)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
