import { useStore } from '@/store/useStore';
import { Slider } from '@/components/ui/Slider';
import { TrendingUp } from 'lucide-react';

export function ForecastAssumptionsSection() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <TrendingUp className="h-4 w-4" /> Forecast Assumptions
      </h3>
      <Slider
        label="Property growth (% p.a.)"
        value={store.propertyGrowthRate}
        min={-5}
        max={10}
        step={0.25}
        suffix="%"
        onChange={(v) => setField('propertyGrowthRate', v)}
      />
      <Slider
        label="Rate increase from year 2 (pp)"
        value={store.rateIncreaseYear2}
        min={-2}
        max={3}
        step={0.1}
        suffix=" pp"
        onChange={(v) => setField('rateIncreaseYear2', v)}
      />
    </div>
  );
}
