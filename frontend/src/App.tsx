import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummarySection } from '@/components/summary/SummarySection';
import { ForecastSection } from '@/components/forecast/ForecastSection';
import { RiskSection } from '@/components/risk/RiskSection';
import { HelpSection } from '@/components/help/HelpSection';
import { useStateBenefits } from '@/hooks/useStateBenefits';
import { cn } from '@/lib/utils';
import { CostOfLivingSection } from '@/components/costOfLiving/CostOfLivingSection';
import { BarChart3, TrendingUp, Shield, Wallet, HelpCircle } from 'lucide-react';

const TABS = [
  { id: 'summary', label: 'Summary', icon: BarChart3 },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'risk', label: 'What If?', icon: Shield },
  { id: 'costOfLiving', label: 'Cost of Living', icon: Wallet },
  { id: 'help', label: 'Help', icon: HelpCircle },
] as const;

type TabId = typeof TABS[number]['id'];

export default function App() {
  useStateBenefits();
  const [activeTab, setActiveTab] = useState<TabId>('summary');

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'summary' && <SummarySection />}
        {activeTab === 'forecast' && <ForecastSection />}
        {activeTab === 'risk' && <RiskSection />}
        {activeTab === 'costOfLiving' && <CostOfLivingSection />}
        {activeTab === 'help' && <HelpSection />}

        {/* Credit */}
        <footer className="mt-10 border-t border-gray-200 py-6 text-center">
          <p className="text-sm text-gray-500">
            Conceived and built by <span className="font-semibold text-gray-700">Claire Boulange</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Property Purchase Calculator
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
