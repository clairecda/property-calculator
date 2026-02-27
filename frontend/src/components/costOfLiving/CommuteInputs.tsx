import { useStore } from '@/store/useStore';
import { Slider } from '@/components/ui/Slider';
import { NumberInput } from '@/components/ui/NumberInput';
import { cn } from '@/lib/utils';
import type { TransportMode } from '@/types';
import { Car, TrainFront, Shuffle } from 'lucide-react';

const MODES: { value: TransportMode; label: string; icon: typeof Car }[] = [
  { value: 'drive', label: 'Drive', icon: Car },
  { value: 'transit', label: 'Public Transport', icon: TrainFront },
  { value: 'mix', label: 'Mix', icon: Shuffle },
];

function ModeToggle({ value, onChange }: { value: TransportMode; onChange: (m: TransportMode) => void }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium text-gray-700">How you get to work</label>
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.value}
              onClick={() => onChange(m.value)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
                value === m.value
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TransportCostInputs({ mode }: { mode: TransportMode }) {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-500">Transport Costs</h4>
      {(mode === 'drive' || mode === 'mix') && (
        <>
          <NumberInput
            label="Car cost per km"
            value={store.carCostPerKm}
            onChange={(v) => setField('carCostPerKm', v)}
            step={0.05}
            prefix="$"
            tooltip="ATO rate for 2024-25 is $0.85/km — covers fuel, wear, rego, insurance"
          />
          <NumberInput
            label="Daily parking cost"
            value={store.carParkingDaily}
            onChange={(v) => setField('carParkingDaily', v)}
            step={5}
            prefix="$"
            tooltip="Leave at $0 if you have free parking at work"
          />
        </>
      )}
      {(mode === 'transit' || mode === 'mix') && (
        <NumberInput
          label="Monthly transit pass"
          value={store.monthlyTransitPass}
          onChange={(v) => setField('monthlyTransitPass', v)}
          step={10}
          prefix="$"
          tooltip="Opal, Myki, Go Card etc. — typical AU metro pass"
        />
      )}
      {mode === 'mix' && (
        <p className="text-xs text-gray-400">
          Mix assumes 3 days driving + transit pass for the rest
        </p>
      )}
    </div>
  );
}

export function CommuteInputs() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-4 font-semibold text-gray-800">Your Commute</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Work address</label>
            <p className="mb-1 text-xs text-gray-400">Where you work (just for your reference)</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              placeholder="e.g. 123 Collins St, Melbourne"
              value={store.workAddress}
              onChange={(e) => setField('workAddress', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Property address</label>
            <p className="mb-1 text-xs text-gray-400">The property you're buying</p>
            <input
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              placeholder="e.g. 45 Beach Rd, Brighton"
              value={store.propertyAddress || store.propertyName}
              onChange={(e) => setField('propertyAddress', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Slider
            label="One-way distance"
            value={store.commuteDistanceKm}
            min={1}
            max={100}
            step={1}
            suffix=" km"
            onChange={(v) => setField('commuteDistanceKm', v)}
          />
          <Slider
            label="One-way travel time"
            value={store.commuteDurationMinutes}
            min={5}
            max={120}
            step={5}
            suffix=" min"
            onChange={(v) => setField('commuteDurationMinutes', v)}
          />
        </div>

        <Slider
          label="Days commuting per week"
          value={store.commuteDaysPerWeek}
          min={1}
          max={7}
          step={1}
          suffix=" days"
          onChange={(v) => setField('commuteDaysPerWeek', v)}
        />

        <ModeToggle value={store.transportMode} onChange={(v) => setField('transportMode', v)} />
      </div>

      <TransportCostInputs mode={store.transportMode} />

      {store.hasPartner && (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-gray-800">Partner's Commute</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Partner's work address</label>
            <input
              type="text"
              className="mb-3 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              placeholder="e.g. 200 George St, Sydney"
              value={store.partnerWorkAddress}
              onChange={(e) => setField('partnerWorkAddress', e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Slider
              label="One-way distance"
              value={store.partnerCommuteDistanceKm}
              min={0}
              max={100}
              step={1}
              suffix=" km"
              onChange={(v) => setField('partnerCommuteDistanceKm', v)}
            />
            <Slider
              label="One-way travel time"
              value={store.partnerCommuteDurationMinutes}
              min={0}
              max={120}
              step={5}
              suffix=" min"
              onChange={(v) => setField('partnerCommuteDurationMinutes', v)}
            />
          </div>
          <ModeToggle value={store.partnerTransportMode} onChange={(v) => setField('partnerTransportMode', v)} />
        </div>
      )}
    </div>
  );
}
