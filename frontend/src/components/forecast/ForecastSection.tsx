import { useMemo } from 'react';
import { useForecast } from '@/hooks/useForecast';
import { KpiCard } from '@/components/ui/KpiCard';
import { Alert } from '@/components/ui/Alert';
import { formatDollar, formatDollarK } from '@/lib/formatters';
import { MILESTONE_YEARS } from '@/constants/defaults';
import { Home, TrendingUp, PiggyBank, Info, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const dollarFormatter = (v: number) => formatDollarK(v);

export function ForecastSection() {
  const forecast = useForecast();

  const value10yr = forecast[10]?.propertyValue ?? 0;
  const equity10yr = forecast[10]?.equity ?? 0;
  const paidOffYear = forecast.findIndex((r) => r.year > 0 && r.loanBalance <= 100);
  const paidOffLabel = paidOffYear > 0 ? `Year ${forecast[paidOffYear].year}` : 'After 30 years';
  const totalInterest = forecast.reduce((sum, r) => sum + r.interestPaid, 0);

  // Chart data
  const valueLoanData = forecast.map((r) => ({
    year: r.year,
    'Property Value': r.propertyValue,
    'Loan Balance': r.loanBalance,
  }));

  const equityData = forecast.map((r) => ({
    year: r.year,
    Equity: r.equity,
  }));

  const interestPrincipalData = useMemo(() => {
    let cumPrincipal = 0;
    let cumInterest = 0;
    return forecast.filter((r) => r.year > 0).map((r) => {
      cumPrincipal += r.principalPaid;
      cumInterest += r.interestPaid;
      return {
        year: r.year,
        Principal: cumPrincipal,
        Interest: cumInterest,
      };
    });
  }, [forecast]);

  // Payment breakdown table
  const paymentTable = useMemo(() => {
    let cumPrincipal = 0;
    let cumInterest = 0;
    return forecast.filter((r) => r.year > 0).map((r) => {
      cumPrincipal += r.principalPaid;
      cumInterest += r.interestPaid;
      const total = cumPrincipal + cumInterest;
      return {
        year: r.year,
        cumPrincipal,
        cumInterest,
        total,
        principalPct: total > 0 ? (cumPrincipal / total) * 100 : 0,
        interestPct: total > 0 ? (cumInterest / total) * 100 : 0,
      };
    }).filter((r) => MILESTONE_YEARS.includes(r.year));
  }, [forecast]);

  return (
    <section id="forecast">
      <h2 className="mb-4 text-xl font-bold text-gray-800">30-Year Forecast</h2>

      {/* Milestone KPI cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Home className="h-4 w-4" />} label="Property Value @ 10yr" value={formatDollar(value10yr)} />
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Your Equity @ 10yr" value={formatDollar(equity10yr)} />
        <KpiCard icon={<PiggyBank className="h-4 w-4" />} label="Loan Paid Off" value={paidOffLabel} />
      </div>

      <Alert variant="info" className="mb-4">
        <span className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>These are projections, not guarantees!</strong> Property value grows at the rate you set (default 5%/year). Real house prices can go up more, less, or down.
          </span>
        </span>
      </Alert>

      {/* Charts */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Property Value vs Loan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={valueLoanData}>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={dollarFormatter} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v?: number | string) => formatDollar(Number(v ?? 0))} />
              <Area type="monotone" dataKey="Property Value" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
              <Area type="monotone" dataKey="Loan Balance" stroke="#c53030" fill="#c53030" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Equity Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={equityData}>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={dollarFormatter} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v?: number | string) => formatDollar(Number(v ?? 0))} />
              <Area type="monotone" dataKey="Equity" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Interest vs Principal Paid</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={interestPrincipalData}>
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={dollarFormatter} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v?: number | string) => formatDollar(Number(v ?? 0))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Principal" stackId="1" stroke="#0284c7" fill="#0284c7" fillOpacity={0.7} />
              <Area type="monotone" dataKey="Interest" stackId="1" stroke="#c53030" fill="#c53030" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Alert variant="warning" className="mb-6">
        <span className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Total Interest Over Loan: {formatDollar(totalInterest)}</strong> — This is money paid to the bank that doesn't build equity.
          </span>
        </span>
      </Alert>

      {/* Payment breakdown table */}
      <h3 className="mb-3 text-lg font-semibold text-gray-800">Payment Breakdown: Where Your Money Goes</h3>
      <p className="mb-3 text-sm text-gray-500">
        See how much you've paid toward owning the house vs. paying the bank in interest.
      </p>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Year</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Principal Paid (Builds Equity)</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Interest Paid (To Bank)</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {paymentTable.map((row) => (
              <tr key={row.year} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.year}</td>
                <td className="px-4 py-3 text-sky-700">
                  {formatDollar(row.cumPrincipal)} ({Math.round(row.principalPct)}%)
                </td>
                <td className="px-4 py-3 text-red-600">
                  {formatDollar(row.cumInterest)} ({Math.round(row.interestPct)}%)
                </td>
                <td className="px-4 py-3 font-medium">{formatDollar(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
