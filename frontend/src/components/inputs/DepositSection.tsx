import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DepositSection() {
  const hasPartner = useStore((s) => s.hasPartner);
  const yourDeposit = useStore((s) => s.yourDeposit);
  const partnerDeposit = useStore((s) => s.partnerDeposit);
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <PiggyBank className="h-4 w-4" /> Deposits
      </h3>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setField('hasPartner', false);
            setField('partnerDeposit', 0);
          }}
          className={cn(
            'flex-1 rounded border px-3 py-1.5 text-xs font-medium transition-all',
            !hasPartner
              ? 'border-sky-600 bg-sky-50 text-sky-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50',
          )}
        >
          Alone
        </button>
        <button
          onClick={() => setField('hasPartner', true)}
          className={cn(
            'flex-1 rounded border px-3 py-1.5 text-xs font-medium transition-all',
            hasPartner
              ? 'border-sky-600 bg-sky-50 text-sky-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50',
          )}
        >
          With partner
        </button>
      </div>

      <NumberInput
        label="Your deposit"
        value={yourDeposit}
        onChange={(v) => setField('yourDeposit', v)}
        step={1000}
      />
      {hasPartner && (
        <NumberInput
          label="Partner deposit"
          value={partnerDeposit}
          onChange={(v) => setField('partnerDeposit', v)}
          step={1000}
        />
      )}
    </div>
  );
}
