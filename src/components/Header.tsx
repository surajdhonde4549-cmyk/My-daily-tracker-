import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react';
import { MONTH_NAMES } from '../utils/date';

interface HeaderProps {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddHabit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBackup: () => void;
  activeTab: 'matrix' | 'today' | 'sleep' | 'analytics';
  setActiveTab: (tab: 'matrix' | 'today' | 'sleep' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddHabit,
  soundEnabled,
  onToggleSound,
  onOpenBackup,
  activeTab,
  setActiveTab,
}) => {
  const isCurrentMonth =
    currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Bar Zone: Brand, Nav tabs, Primary Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
            Somna <span className="text-rose-400">&amp; Habit</span>
          </span>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Habits Matrix
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Today's Focus
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'sleep'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sleep Studio
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Synergy &amp; Trends
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('notes-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Jump down to Daily Notes"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Daily Notes"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={onOpenBackup}
            title="Backup, export, or reset data"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Data options"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onAddHabit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-rose-500/25 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Month Navigation Sub-bar */}
      <div className="bg-[#0b1120] border-t border-slate-800/60 px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevMonth}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-1">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              {!isCurrentMonth && (
                <button
                  onClick={onToday}
                  className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-2 ml-1"
                >
                  Jump to Today
                </button>
              )}
            </div>

            <button
              onClick={onNextMonth}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Today is</span>
            <span className="font-semibold text-slate-200">
              {MONTH_NAMES[new Date().getMonth()]} {new Date().getDate()}, {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
