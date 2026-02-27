import { Home, Menu, X, Share2 } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onShare?: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar, onShare }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4">
      <button
        className="rounded p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Home className="h-5 w-5 text-sky-600" />
      <h1 className="text-lg font-bold text-gray-800">Property Purchase Calculator</h1>
      <div className="flex-1" />
      <span className="hidden text-xs text-gray-400 sm:inline">by Claire Boulange</span>
      {onShare && (
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      )}
    </header>
  );
}
