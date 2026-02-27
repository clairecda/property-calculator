import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CostOfLivingResult } from '@/types';
import { formatDollar } from '@/lib/formatters';

interface CostBreakdownChartProps {
  result: CostOfLivingResult;
  monthlyPropertyCost: number;
}

export function CostBreakdownChart({ result, monthlyPropertyCost }: CostBreakdownChartProps) {
  const data = [
    {
      name: 'Monthly',
      'Property Costs': Math.round(monthlyPropertyCost),
      'Transport': Math.round(result.monthlyTransportCost),
      'Living Expenses': Math.round(result.monthlyLivingExpenses),
    },
    {
      name: 'Annual',
      'Property Costs': Math.round(monthlyPropertyCost * 12),
      'Transport': Math.round(result.annualTransportCost),
      'Living Expenses': Math.round(result.monthlyLivingExpenses * 12),
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-800">Where Your Money Goes</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={60}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatDollar(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Property Costs" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Transport" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Living Expenses" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
