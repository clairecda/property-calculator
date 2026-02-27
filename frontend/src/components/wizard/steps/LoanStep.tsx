import { useStore } from '@/store/useStore';
import { Slider } from '@/components/ui/Slider';

export function LoanStep() {
  const interestRate = useStore((s) => s.interestRate);
  const loanTerm = useStore((s) => s.loanTerm);
  const setField = useStore((s) => s.setField);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Your loan</h2>
        <p className="text-gray-500">Set the interest rate and loan term for your mortgage.</p>
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div>
          <Slider
            label="Interest rate"
            value={interestRate}
            min={1}
            max={12}
            step={0.05}
            suffix="%"
            onChange={(v) => setField('interestRate', v)}
          />
          <p className="mt-1 text-xs text-gray-500">
            The annual percentage rate your lender charges. Most variable rates are around 6-7% right now.
          </p>
        </div>

        <div>
          <Slider
            label="Loan term"
            value={loanTerm}
            min={5}
            max={35}
            step={1}
            suffix=" years"
            onChange={(v) => setField('loanTerm', v)}
          />
          <p className="mt-1 text-xs text-gray-500">
            How long you'll take to repay the loan. 30 years is standard in Australia. A shorter term means higher repayments but less total interest.
          </p>
        </div>
      </div>
    </div>
  );
}
