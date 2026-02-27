import { useState } from 'react';
import { PropertySection } from '@/components/inputs/PropertySection';
import { DepositSection } from '@/components/inputs/DepositSection';
import { LoanSection } from '@/components/inputs/LoanSection';
import { OngoingCostsSection } from '@/components/inputs/OngoingCostsSection';
import { UpfrontCostsSection } from '@/components/inputs/UpfrontCostsSection';
import { ForecastAssumptionsSection } from '@/components/inputs/ForecastSection';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { NumberInput } from '@/components/ui/NumberInput';

interface SidebarProps {
  className?: string;
}

function BenefitsBadge() {
  const source = useStore((s) => s.benefitsSource);
  const colors = {
    live: 'bg-green-100 text-green-700',
    cached: 'bg-amber-100 text-amber-700',
    default: 'bg-gray-100 text-gray-600',
  };
  const labels = { live: 'Live', cached: 'Cached', default: 'Default' };

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', colors[source])}>
      Data: {labels[source]}
    </span>
  );
}

function LmiInput() {
  const lmi = useStore((s) => s.lmi);
  const setField = useStore((s) => s.setField);

  return (
    <NumberInput
      label="LMI"
      value={lmi}
      onChange={(v) => setField('lmi', v)}
      step={500}
      tooltip="Lenders Mortgage Insurance — usually required when LVR > 80%"
    />
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const resetWizard = useStore((s) => s.resetWizard);

  return (
    <aside className={cn('flex flex-col overflow-y-auto bg-white', className)}>
      <div className="flex-1 space-y-5 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Key Settings</h2>
          <BenefitsBadge />
        </div>

        {/* Always visible: Key Settings */}
        <PropertySection />
        <hr className="border-gray-200" />
        <DepositSection />
        <hr className="border-gray-200" />
        <LoanSection />

        {/* Nudge to review fees */}
        {!advancedOpen && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-800">
              The numbers above use estimated fees and costs.{' '}
              <button
                onClick={() => setAdvancedOpen(true)}
                className="font-semibold text-amber-700 underline hover:text-amber-900"
              >
                Review & fine-tune them
              </button>
              {' '}for a more accurate picture.
            </p>
          </div>
        )}

        {/* Collapsed: Advanced Settings */}
        <div className="rounded-lg border border-gray-200">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Advanced Settings
            <ChevronDown className={cn('h-4 w-4 transition-transform', advancedOpen && 'rotate-180')} />
          </button>
          {advancedOpen && (
            <div className="space-y-5 border-t border-gray-200 px-4 py-4">
              <LmiInput />
              <hr className="border-gray-200" />
              <OngoingCostsSection />
              <hr className="border-gray-200" />
              <UpfrontCostsSection />
              <hr className="border-gray-200" />
              <ForecastAssumptionsSection />
            </div>
          )}
        </div>
      </div>

      {/* Reset wizard link */}
      <div className="border-t border-gray-200 px-5 py-3">
        <button
          onClick={resetWizard}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-sky-600"
        >
          <RotateCcw className="h-3 w-3" />
          Reset wizard
        </button>
      </div>
    </aside>
  );
}
