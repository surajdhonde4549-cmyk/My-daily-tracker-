import React from 'react';
import { LayoutGrid, CheckSquare, Moon, TrendingUp, FileText } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'matrix' | 'today' | 'sleep' | 'analytics';
  setActiveTab: (tab: 'matrix' | 'today' | 'sleep' | 'analytics') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'matrix' as const, label: 'Matrix', icon: LayoutGrid },
    { id: 'today' as const, label: "Today", icon: CheckSquare },
    { id: 'sleep' as const, label: 'Sleep', icon: Moon },
    { id: 'analytics' as const, label: 'Synergy', icon: TrendingUp },
  ];

  const handleNotesClick = () => {
    const el = document.getElementById('notes-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-colors active:scale-95 ${
                isActive ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-rose-500/20 text-rose-400' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* Notes 5th Tab */}
        <button
          onClick={handleNotesClick}
          className="min-h-[48px] flex flex-col items-center justify-center transition-colors active:scale-95 text-slate-400 hover:text-indigo-400"
        >
          <div className="p-1 rounded-lg hover:bg-indigo-500/20">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Notes</span>
        </button>
      </div>
    </nav>
  );
};

