import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { Receipt } from 'lucide-react';

export function UpfrontCostsSection() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Receipt className="h-4 w-4" /> Other Upfront Costs
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Legal fees" value={store.legalFees} onChange={(v) => setField('legalFees', v)} step={50} />
        <NumberInput label="Inspection" value={store.inspection} onChange={(v) => setField('inspection', v)} step={50} />
        <NumberInput label="Loan application" value={store.loanApplication} onChange={(v) => setField('loanApplication', v)} step={50} />
        <NumberInput label="Valuation" value={store.valuation} onChange={(v) => setField('valuation', v)} step={50} />
        <NumberInput label="Mortgage reg." value={store.mortgageReg} onChange={(v) => setField('mortgageReg', v)} step={5} />
        <NumberInput label="Title fees" value={store.titleFees} onChange={(v) => setField('titleFees', v)} step={10} />
        <NumberInput label="Moving" value={store.moving} onChange={(v) => setField('moving', v)} step={50} />
        <NumberInput label="Initial repairs" value={store.repairs} onChange={(v) => setField('repairs', v)} step={100} />
      </div>
    </div>
  );
}
