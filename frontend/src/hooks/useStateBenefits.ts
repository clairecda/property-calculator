import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import type { AustralianState, StateBenefits } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function useStateBenefits() {
  const setLiveBenefits = useStore((s) => s.setLiveBenefits);

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
