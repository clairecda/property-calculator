import { create } from 'zustand';
import type { InputState, AustralianState, BenefitsSource, StateBenefits } from '@/types';
import { DEFAULT_INPUTS } from '@/constants/defaults';

const WIZARD_KEY = 'wizardComplete';

function readWizardFlag(): boolean {
  try {
    return localStorage.getItem(WIZARD_KEY) === 'true';
  } catch {
    return false;
  }
}

interface StoreState extends InputState {
  benefitsSource: BenefitsSource;
  liveBenefits: Record<AustralianState, StateBenefits> | null;
  setField: <K extends keyof InputState>(key: K, value: InputState[K]) => void;
  setLiveBenefits: (benefits: Record<AustralianState, StateBenefits>, source: BenefitsSource) => void;
  completeWizard: () => void;
  resetWizard: () => void;
}

export const useStore = create<StoreState>((set) => ({
  ...DEFAULT_INPUTS,
  wizardComplete: readWizardFlag(),
  benefitsSource: 'default',
  liveBenefits: null,
  setField: (key, value) => set({ [key]: value }),
  setLiveBenefits: (benefits, source) => set({ liveBenefits: benefits, benefitsSource: source }),
  completeWizard: () => {
    try { localStorage.setItem(WIZARD_KEY, 'true'); } catch {}
    set({ wizardComplete: true });
  },
  resetWizard: () => {
    try { localStorage.removeItem(WIZARD_KEY); } catch {}
    set({ wizardComplete: false });
  },
}));
