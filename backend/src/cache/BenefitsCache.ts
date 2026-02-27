import * as fs from 'fs';
import * as path from 'path';

export interface StateBenefits {
  grant: number;
  stampDutyConcession: number;
}

type BenefitsMap = Record<string, StateBenefits>;

interface CacheEntry {
  data: BenefitsMap;
  timestamp: number;
}

const TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE = path.join(__dirname, '..', 'data', 'cache.json');
const FALLBACK_FILE = path.join(__dirname, '..', 'data', 'fallbackBenefits.json');

export class BenefitsCache {
  private memory: CacheEntry | null = null;

  constructor() {
    this.loadFromDisk();
  }

  get(): { data: BenefitsMap; source: 'live' | 'cached' | 'default' } {
    // Try in-memory cache
    if (this.memory && Date.now() - this.memory.timestamp < TTL) {
      return { data: this.memory.data, source: 'cached' };
    }

    // Try disk cache
    this.loadFromDisk();
    if (this.memory && Date.now() - this.memory.timestamp < TTL) {
      return { data: this.memory.data, source: 'cached' };
    }

    // Fallback to hard-coded
    const fallback = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf-8'));
    return { data: fallback, source: 'default' };
  }

  set(data: BenefitsMap): void {
    this.memory = { data, timestamp: Date.now() };
    this.saveToDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        this.memory = raw;
      }
    } catch {
      // Ignore disk errors
    }
  }

  private saveToDisk(): void {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.memory), 'utf-8');
    } catch {
      // Ignore disk errors
    }
  }
}
