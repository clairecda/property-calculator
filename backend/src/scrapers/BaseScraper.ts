import type { StateBenefits } from '../cache/BenefitsCache';

export abstract class BaseScraper {
  abstract state: string;
  abstract url: string;

  async scrape(): Promise<StateBenefits | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(this.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PropertyCalculator/1.0 (educational tool)',
        },
      });
      clearTimeout(timeout);

      if (!res.ok) return null;

      const html = await res.text();
      return this.parse(html);
    } catch {
      return null;
    }
  }

  protected abstract parse(html: string): StateBenefits | null;
}
