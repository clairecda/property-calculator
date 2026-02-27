import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';

export function BudgetStep() {
  const purchasePrice = useStore((s) => s.purchasePrice);
  const stampDuty = useStore((s) => s.stampDuty);
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">What's your budget?</h2>
        <p className="text-gray-500">Enter the property price and stamp duty amount.</p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <NumberInput
          label="Purchase price"
          value={purchasePrice}
          onChange={(v) => setField('purchasePrice', v)}
          step={5000}
        />
        <NumberInput
          label="Stamp duty (before concessions)"
          value={stampDuty}
          onChange={(v) => setField('stampDuty', v)}
          step={500}
          tooltip="Check your state's transfer duty calculator for the exact amount"
        />
      </div>
    </div>
  );
}
