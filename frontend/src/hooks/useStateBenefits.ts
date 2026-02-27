import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { FALLBACK_BENEFITS } from '@/constants/defaults';
import type { AustralianState, StateBenefits } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

/** Sync the editable grant/concession fields when state or data source changes */
function applyBenefitsToStore(
  state: AustralianState,
  benefits: Record<AustralianState, StateBenefits>,
) {
  const b = benefits[state] ?? { grant: 0, stampDutyConcession: 0 };
  const store = useStore.getState();
  store.setField('firstHomeGrant', b.grant);
  store.setField('stampDutyConcession', b.stampDutyConcession);
}

export function useStateBenefits() {
  const setLiveBenefits = useStore((s) => s.setLiveBenefits);
  const state = useStore((s) => s.state);
  const liveBenefits = useStore((s) => s.liveBenefits);

  // When state changes, re-seed from best available data
  useEffect(() => {
    const source = liveBenefits ?? FALLBACK_BENEFITS;
    applyBenefitsToStore(state, source);
  }, [state, liveBenefits]);

  // Fetch live data on mount
  useEffect(() => {
    if (!API_URL) return;

    const controller = new AbortController();

    fetch(`${API_URL}/api/state-benefits`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json() as Promise<{ data: Record<AustralianState, StateBenefits>; source: 'live' | 'cached' }>;
      })
      .then(({ data, source }) => {
        setLiveBenefits(data, source);
      })
      .catch(() => {
        // Silently fall back to defaults
      });

    return () => controller.abort();
  }, [setLiveBenefits]);
}
