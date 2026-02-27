import { useStore } from '@/store/useStore';
import { NumberInput } from '@/components/ui/NumberInput';
import { formatDollar } from '@/lib/formatters';

export function LivingExpensesInputs() {
  const store = useStore();
  const setField = useStore((s) => s.setField);

  const total =
    store.monthlyGroceries + store.monthlyDiningOut + store.monthlyUtilities +
    store.monthlyInternet + store.monthlySubscriptions + store.monthlyHealthInsurance +
    store.monthlyOtherExpenses;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-1 font-semibold text-gray-800">Monthly Living Expenses</h3>
      <p className="mb-4 text-sm text-gray-500">
        Typical household costs — adjust to match your spending
      </p>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <NumberInput
          label="Groceries"
          value={store.monthlyGroceries}
          onChange={(v) => setField('monthlyGroceries', v)}
          step={50}
          tooltip="Weekly groceries for your household"
        />
        <NumberInput
          label="Dining out & takeaway"
          value={store.monthlyDiningOut}
          onChange={(v) => setField('monthlyDiningOut', v)}
          step={50}
          tooltip="Restaurants, coffee, delivery apps"
        />
        <NumberInput
          label="Utilities"
          value={store.monthlyUtilities}
          onChange={(v) => setField('monthlyUtilities', v)}
          step={25}
          tooltip="Electricity, gas, water usage"
        />
        <NumberInput
          label="Internet"
          value={store.monthlyInternet}
          onChange={(v) => setField('monthlyInternet', v)}
          step={10}
          tooltip="Home broadband / NBN plan"
        />
        <NumberInput
          label="Subscriptions"
          value={store.monthlySubscriptions}
          onChange={(v) => setField('monthlySubscriptions', v)}
          step={10}
          tooltip="Streaming, gym, apps, memberships"
        />
        <NumberInput
          label="Health insurance"
          value={store.monthlyHealthInsurance}
          onChange={(v) => setField('monthlyHealthInsurance', v)}
          step={25}
          tooltip="Private health cover — skip if not applicable"
        />
        <NumberInput
          label="Other"
          value={store.monthlyOtherExpenses}
          onChange={(v) => setField('monthlyOtherExpenses', v)}
          step={50}
          tooltip="Anything else — clothing, pets, personal care"
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-sm font-semibold text-gray-800">Total monthly living</span>
        <span className="text-lg font-bold text-sky-600">{formatDollar(total)}</span>
      </div>
    </div>
  );
}
