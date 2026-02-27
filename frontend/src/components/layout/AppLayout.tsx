import { useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Wizard } from '@/components/wizard/Wizard';
import { ShareModal } from '@/components/share/ShareModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const wizardComplete = useStore((s) => s.wizardComplete);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  if (!wizardComplete) {
    return <Wizard />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onShare={() => setShareOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <Sidebar className="hidden w-[400px] shrink-0 border-r border-gray-200 lg:flex lg:flex-col" />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={toggleSidebar} />
            <Sidebar className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[400px] flex-col shadow-xl lg:hidden" />
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
