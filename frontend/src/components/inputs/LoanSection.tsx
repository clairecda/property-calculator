import { useStore } from '@/store/useStore';
import { Slider } from '@/components/ui/Slider';
import { Percent } from 'lucide-react';

export function LoanSection() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Percent className="h-4 w-4" /> Loan Settings
      </h3>
      <Slider
        label="Interest rate (% p.a.)"
        value={store.interestRate}
        min={1}
        max={12}
        step={0.05}
        suffix="%"
        onChange={(v) => setField('interestRate', v)}
      />
      <Slider
        label="Loan term (years)"
        value={store.loanTerm}
        min={5}
        max={35}
        step={1}
        suffix=" yrs"
        onChange={(v) => setField('loanTerm', v)}
      />
    </div>
  );
}
