import type { StateBenefits } from '../cache/BenefitsCache';
import { BaseScraper } from './BaseScraper';
import * as cheerio from 'cheerio';

// Each state scraper attempts to pull grant and stamp duty concession info.
// These are fragile by nature - government websites change often.
// When scraping fails, the system falls back to cached or hard-coded values.

class NSWScraper extends BaseScraper {
  state = 'NSW';
  url = 'https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty';
  protected parse(_html: string): StateBenefits | null {
    // NSW has no FHOG but has stamp duty exemptions for properties under thresholds
    // Parsing government pages is complex and brittle - return null to use fallback
    return null;
  }
}

class VICScraper extends BaseScraper {
  state = 'VIC';
  url = 'https://www.sro.vic.gov.au/first-home-owner';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class QLDScraper extends BaseScraper {
  state = 'QLD';
  url = 'https://qro.qld.gov.au/duties/transfer-duty/exemptions-concessions/home-concession/';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class WAScraper extends BaseScraper {
  state = 'WA';
  url = 'https://www.wa.gov.au/organisation/department-of-finance/first-home-owner-grant';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class SAScraper extends BaseScraper {
  state = 'SA';
  url = 'https://www.revenuesa.sa.gov.au/grants-and-concessions';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class TASScraper extends BaseScraper {
  state = 'TAS';
  url = 'https://www.sro.tas.gov.au/first-home-owner';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class ACTScraper extends BaseScraper {
  state = 'ACT';
  url = 'https://www.revenue.act.gov.au/home-buyer-concession-scheme';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

class NTScraper extends BaseScraper {
  state = 'NT';
  url = 'https://nt.gov.au/property/home-owner-assistance/first-home-owner-grant';
  protected parse(_html: string): StateBenefits | null {
    return null;
  }
}

export const scrapers: BaseScraper[] = [
  new NSWScraper(),
  new VICScraper(),
  new QLDScraper(),
  new WAScraper(),
  new SAScraper(),
  new TASScraper(),
  new ACTScraper(),
  new NTScraper(),
];

// Re-export cheerio for future scraper implementations
export { cheerio };
