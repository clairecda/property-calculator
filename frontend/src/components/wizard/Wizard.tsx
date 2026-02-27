import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { StateStep } from './steps/StateStep';
import { BudgetStep } from './steps/BudgetStep';
import { DepositStep } from './steps/DepositStep';
import { LoanStep } from './steps/LoanStep';
import { PreviewStep } from './steps/PreviewStep';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Location', component: StateStep },
  { label: 'Budget', component: BudgetStep },
  { label: 'Deposit', component: DepositStep },
  { label: 'Loan', component: LoanStep },
  { label: 'Preview', component: PreviewStep },
];

export function Wizard() {
  const [step, setStep] = useState(0);
  const completeWizard = useStore((s) => s.completeWizard);
  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  const next = useCallback(() => {
    if (isLastStep) return;
    setStep((s) => s + 1);
  }, [isLastStep]);

  const back = useCallback(() => {
    if (isFirstStep) return;
    setStep((s) => s - 1);
  }, [isFirstStep]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !isLastStep) next();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, isLastStep]);

  const StepComponent = STEPS[step].component;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 border-b border-gray-200 bg-white px-4 py-4">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                i === step
                  ? 'bg-sky-600 text-white'
                  : i < step
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-gray-200 text-gray-500',
              )}
            >
              {i + 1}
            </button>
            <span className={cn(
              'hidden text-sm sm:inline',
              i === step ? 'font-semibold text-sky-700' : 'text-gray-400',
            )}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-px w-6 sm:w-10',
                i < step ? 'bg-sky-300' : 'bg-gray-200',
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-8 sm:items-center sm:py-12">
        <div className="w-full max-w-2xl">
          <StepComponent />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            onClick={back}
            disabled={isFirstStep}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all',
              isFirstStep
                ? 'invisible'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {isLastStep ? (
            <button
              onClick={completeWizard}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700"
            >
              <Rocket className="h-4 w-4" />
              Explore Full Results
            </button>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
