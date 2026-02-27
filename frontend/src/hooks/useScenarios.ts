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
      ...calculateScenario(costs, s.priceAdd, s.rateAdd, s.growthOverride ?? growth, rateBump),
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
  const growthChange = useStore((s) => s.scenarioGrowthChange);

  const effectiveGrowth = growthChange !== 0 ? growth + growthChange : growth;

  return useMemo(
    () => calculateCustomScenario(costs, priceChange, rateChange, effectiveGrowth, rateBump),
    [costs, priceChange, rateChange, effectiveGrowth, rateBump],
  );
}
