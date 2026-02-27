interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
  tooltip?: string;
}

export function NumberInput({ label, value, onChange, min = 0, step = 100, prefix = '$', tooltip }: NumberInputProps) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {tooltip && (
        <p className="mb-1 text-xs text-gray-400">{tooltip}</p>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          className="w-full rounded border border-gray-300 py-2 pr-3 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
          style={{ paddingLeft: prefix ? '1.75rem' : '0.75rem' }}
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
