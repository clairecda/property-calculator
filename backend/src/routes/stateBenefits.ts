import { Router } from 'express';
import { BenefitsCache } from '../cache/BenefitsCache';
import { scrapers } from '../scrapers';

const router = Router();
const cache = new BenefitsCache();

// Try scraping all states, update cache with any successes
async function refreshCache(): Promise<void> {
  const current = cache.get();
  const updated = { ...current.data };
  let anySuccess = false;

  const results = await Promise.allSettled(
    scrapers.map(async (s) => {
      const result = await s.scrape();
      return { state: s.state, result };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.result) {
      updated[r.value.state] = r.value.result;
      anySuccess = true;
    }
  }

  if (anySuccess) {
    cache.set(updated);
  }
}

router.get('/state-benefits', async (_req, res) => {
  // Return current cache immediately, trigger refresh in background
  const { data, source } = cache.get();

  // Non-blocking refresh
  refreshCache().catch(() => {});

  res.json({ data, source });
});

export default router;
