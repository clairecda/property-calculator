import { cn } from '@/lib/utils';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: 'sky' | 'red' | 'amber';
}

const colorMap = {
  sky: 'border-sky-600 text-sky-600',
  red: 'border-red-600 text-red-600',
  amber: 'border-amber-500 text-amber-600',
};

export function KpiCard({ icon, label, value, color = 'sky' }: KpiCardProps) {
  return (
    <div className={cn('rounded border bg-white text-center', colorMap[color])}>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-center gap-1.5 text-sm text-gray-500">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
