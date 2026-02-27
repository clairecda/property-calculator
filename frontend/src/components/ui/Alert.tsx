import { cn } from '@/lib/utils';

interface AlertProps {
  variant: 'info' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  info: 'bg-sky-50 border-sky-300 text-sky-800',
  warning: 'bg-amber-50 border-amber-300 text-amber-900',
  danger: 'bg-red-50 border-red-300 text-red-900',
};

export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div className={cn('rounded border p-4 text-sm', variants[variant], className)}>
      {children}
    </div>
  );
}
