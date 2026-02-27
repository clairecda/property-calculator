import { useStore } from '@/store/useStore';
import { STATES } from '@/constants/defaults';
import type { AustralianState } from '@/types';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATE_LABELS: Record<AustralianState, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'ACT',
  NT: 'Northern Territory',
};

export function StateStep() {
  const state = useStore((s) => s.state);
  const isFirstHome = useStore((s) => s.isFirstHome);
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Where are you buying?</h2>
        <p className="text-gray-500">Select the state or territory where you plan to purchase.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATES.map((s) => (
          <button
            key={s}
            onClick={() => setField('state', s)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border-2 px-4 py-4 text-sm font-semibold transition-all',
              state === s
                ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
            )}
          >
            <span className="text-lg">{s}</span>
            <span className="text-xs font-normal text-gray-500">{STATE_LABELS[s]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
            checked={isFirstHome}
            onChange={(e) => setField('isFirstHome', e.target.checked)}
          />
          <Star className="h-5 w-5 text-amber-500" />
          <div>
            <span className="font-semibold text-gray-800">First Home Buyer</span>
            <p className="text-sm text-gray-500">This unlocks grants & stamp duty savings in your state</p>
          </div>
        </label>
      </div>
    </div>
  );
}
