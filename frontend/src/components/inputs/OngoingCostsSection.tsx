import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { CalendarDays } from 'lucide-react';

export function OngoingCostsSection() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <CalendarDays className="h-4 w-4" /> Ongoing Costs (Annual)
      </h3>
      <NumberInput label="Council rates" value={store.councilRates} onChange={(v) => setField('councilRates', v)} step={50} />
      <NumberInput label="Water rates" value={store.waterRates} onChange={(v) => setField('waterRates', v)} step={50} />
      <NumberInput label="Strata / Body corp" value={store.strataFees} onChange={(v) => setField('strataFees', v)} step={50} />
      <NumberInput label="Insurance" value={store.insurance} onChange={(v) => setField('insurance', v)} step={50} />
      <Slider
        label="Maintenance (% of value/yr)"
        value={store.maintenancePercent}
        min={0}
        max={3}
        step={0.1}
        suffix="%"
        onChange={(v) => setField('maintenancePercent', v)}
        tooltip="Simple allowance for wear/tear."
      />
    </div>
  );
}
