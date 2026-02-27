import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { cn } from '@/lib/utils';

export function DepositStep() {
  const hasPartner = useStore((s) => s.hasPartner);
  const yourDeposit = useStore((s) => s.yourDeposit);
  const partnerDeposit = useStore((s) => s.partnerDeposit);
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Your deposit</h2>
        <p className="text-gray-500">How much have you saved toward the purchase?</p>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Buying alone or with someone?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setField('hasPartner', false);
                setField('partnerDeposit', 0);
              }}
              className={cn(
                'rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all',
                !hasPartner
                  ? 'border-sky-600 bg-sky-50 text-sky-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
              )}
            >
              Buying alone
            </button>
            <button
              onClick={() => setField('hasPartner', true)}
              className={cn(
                'rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all',
                hasPartner
                  ? 'border-sky-600 bg-sky-50 text-sky-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
              )}
            >
              With someone
            </button>
          </div>
        </div>

        <NumberInput
          label="Your deposit"
          value={yourDeposit}
          onChange={(v) => setField('yourDeposit', v)}
          step={1000}
        />

        {hasPartner && (
          <NumberInput
            label="Partner's deposit"
            value={partnerDeposit}
            onChange={(v) => setField('partnerDeposit', v)}
            step={1000}
          />
        )}
      </div>
    </div>
  );
}
