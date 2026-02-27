import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculateForecast } from '@/lib/calculations';
import { usePropertyCosts } from './usePropertyCosts';

export function useForecast() {
  const costs = usePropertyCosts();
  const growth = useStore((s) => s.propertyGrowthRate);
  const rateBump = useStore((s) => s.rateIncreaseYear2);

  return useMemo(
    () => calculateForecast(costs, 30, growth, rateBump),
    [costs, growth, rateBump],
  );
}
