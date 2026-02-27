import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculateScenario, calculateCustomScenario } from '@/lib/calculations';
import { usePropertyCosts } from './usePropertyCosts';
import { SCENARIOS } from '@/constants/defaults';
import type { ScenarioResult } from '@/types';

export function useScenarios() {
  const costs = usePropertyCosts();
  const growth = useStore((s) => s.propertyGrowthRate);
  const rateBump = useStore((s) => s.rateIncreaseYear2);

  return useMemo<ScenarioResult[]>(() => {
    return SCENARIOS.map((s) => ({
      ...calculateScenario(costs, s.priceAdd, s.rateAdd, growth, rateBump),
      name: s.name,
    }));
  }, [costs, growth, rateBump]);
}

export function useCustomScenario() {
  const costs = usePropertyCosts();
  const growth = useStore((s) => s.propertyGrowthRate);
  const rateBump = useStore((s) => s.rateIncreaseYear2);
  const priceChange = useStore((s) => s.scenarioPriceChange);
  const rateChange = useStore((s) => s.scenarioRateChange);

  return useMemo(
    () => calculateCustomScenario(costs, priceChange, rateChange, growth, rateBump),
    [costs, priceChange, rateChange, growth, rateBump],
  );
}
