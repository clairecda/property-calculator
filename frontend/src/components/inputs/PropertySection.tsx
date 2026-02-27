import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { STATES } from '@/constants/defaults';
import { Home, Star } from 'lucide-react';

export function PropertySection() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Home className="h-4 w-4" /> Property Details
      </h3>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
        <select
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
          value={store.state}
          onChange={(e) => setField('state', e.target.value as typeof store.state)}
        >
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
          checked={store.isFirstHome}
          onChange={(e) => setField('isFirstHome', e.target.checked)}
        />
        <Star className="h-4 w-4 text-amber-500" />
        First Home Buyer
      </label>

      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-gray-700">Property name</label>
        <input
          type="text"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
          value={store.propertyName}
          onChange={(e) => setField('propertyName', e.target.value)}
        />
      </div>

      <NumberInput
        label="Purchase price"
        value={store.purchasePrice}
        onChange={(v) => setField('purchasePrice', v)}
        step={5000}
        tooltip="Contract price before costs."
      />
      <NumberInput
        label="Stamp duty (before concessions)"
        value={store.stampDuty}
        onChange={(v) => setField('stampDuty', v)}
        step={500}
        tooltip="Enter the full duty before any first-home concession."
      />
    </div>
  );
}
