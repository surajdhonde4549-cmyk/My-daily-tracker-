import React, { useState } from 'react';
import {
  Moon,
  Clock,
  Plus,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { SleepData, SleepLog } from '../types';
import {
  WEEKDAYS,
  MONTH_NAMES,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateKey,
  formatTimeDisplay,
} from '../utils/date';

interface SleepStudioProps {
  sleepLogs: SleepData;
  currentMonth: number;
  currentYear: number;
  targetSleepHours: number;
  onOpenSleepModal: (dateKey: string) => void;
}

export const SleepStudio: React.FC<SleepStudioProps> = ({
  sleepLogs,
  currentMonth,
  currentYear,
  targetSleepHours,
  onOpenSleepModal,
}) => {
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    dateKey: string;
    day: number;
    log?: SleepLog;
  } | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = new Date();

  // Calculate month metrics
  let totalHours = 0;
  let loggedDays = 0;
  let targetMetDays = 0;
  let qualitySum = 0;
  let qualityCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const log = sleepLogs[dateKey];
    if (log && log.hours > 0) {
      totalHours += log.hours;
      loggedDays++;
      if (log.hours >= targetSleepHours) {
        targetMetDays++;
      }
      if (log.quality) {
        qualitySum += log.quality;
        qualityCount++;
      }
    }
  }

  const avgHours = loggedDays > 0 ? (totalHours / loggedDays).toFixed(1) : '0';
  const targetMetRate = loggedDays > 0 ? Math.round((targetMetDays / loggedDays) * 100) : 0;
  const sleepDebt = loggedDays > 0 ? Math.max(0, loggedDays * targetSleepHours - totalHours).toFixed(1) : '0';
  const avgQuality = qualityCount > 0 ? (qualitySum / qualityCount).toFixed(1) : '—';

  // Helper color for duration
  const getSleepColor = (hours: number) => {
    if (hours >= targetSleepHours) {
      return {
        bg: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30 text-emerald-300',
        bar: 'bg-emerald-400',
        text: 'text-emerald-400',
      };
    } else if (hours >= 6) {
      return {
        bg: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-300',
        bar: 'bg-amber-400',
        text: 'text-amber-400',
      };
    } else {
      return {
        bg: 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/30 text-rose-300',
        bar: 'bg-rose-400',
        text: 'text-rose-400',
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Sleep Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Average Sleep
            </div>
            <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
              {avgHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Moon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Target Adherence
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {targetMetRate}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Sleep Debt
            </div>
            <div className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {sleepDebt} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Rest Quality
            </div>
            <div className="text-2xl font-extrabold text-rose-400 tabular-nums">
              {avgQuality} <span className="text-sm font-semibold text-slate-400">/ 5</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sleep Calendar Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Sleep Calendar</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({MONTH_NAMES[currentMonth]} {currentYear})
                </span>
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Optimal (≥{targetSleepHours}h)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Moderate (6–{targetSleepHours - 0.1}h)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  Deficit (&lt;6h)
                </span>
              </div>
            </div>
          </div>

          {/* 7-Col Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Weekday headers */}
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className={`py-1 text-[11px] font-semibold ${
                  i === 0 || i === 6 ? 'text-rose-400/80' : 'text-slate-400'
                }`}
              >
                {wd}
              </div>
            ))}

            {/* Empty offset padding for days before month start */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(currentYear, currentMonth, day);
              const log = sleepLogs[dateKey];
              const hasLog = log && log.hours > 0;
              const colors = hasLog ? getSleepColor(log.hours) : null;
              const isTodayCell =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <button
                  key={dateKey}
                  onClick={() => {
                    setSelectedDayInfo({ dateKey, day, log });
                    onOpenSleepModal(dateKey);
                  }}
                  className={`aspect-square min-h-[50px] sm:min-h-[64px] p-1.5 rounded-xl border flex flex-col items-center justify-between transition-all active:scale-95 text-left relative ${
                    hasLog
                      ? `${colors?.bg} shadow-sm`
                      : 'bg-slate-950/40 hover:bg-slate-800/50 border-slate-800 text-slate-400'
                  } ${isTodayCell ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-900' : ''}`}
                >
                  <div className="w-full flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold tabular-nums ${
                        isTodayCell ? 'text-rose-400 font-extrabold' : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {log?.quality && (
                      <span className="text-[10px] text-amber-400 font-bold">
                        ★{log.quality}
                      </span>
                    )}
                  </div>

                  {hasLog ? (
                    <div className="text-center my-auto">
                      <span className="text-xs sm:text-sm font-extrabold tabular-nums tracking-tight">
                        {log.hours}h
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto opacity-30 hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5 mx-auto text-slate-500" />
                    </div>
                  )}

                  {/* Bedtime indicator hint if recorded */}
                  <div className="w-full text-[9px] text-slate-400 truncate text-center">
                    {log?.bedtime ? formatTimeDisplay(log.bedtime) : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector / Sleep Tip Card */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl shadow-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Sleep Details</span>
              </h3>
              <button
                onClick={() =>
                  onOpenSleepModal(
                    formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
                  )
                }
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                + Log Sleep
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Click any calendar day to log or update your sleep hours, wake times, quality ratings, and bedtime factors.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300">
                Recommended Sleep Targets
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Optimal adult baseline</span>
                  <span className="font-semibold text-slate-200">7.5 – 8.5 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Bedtime</span>
                  <span className="font-semibold text-slate-200">10:30 – 11:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Consistent Sleep Window</span>
                  <span className="font-semibold text-slate-200">&plusmn; 30 mins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-900/40 p-5">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Sleep Hygiene Insight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consistency is king. Going to bed and waking up within the same 30-minute window anchors your circadian rhythm, dramatically improving REM and deep restorative stages.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Sleep Bar Chart */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-xl shadow-slate-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span>Monthly Sleep Duration Chart</span>
            </h3>
            <span className="text-xs text-slate-400">
              Hours slept per day with {targetSleepHours}h target benchmark
            </span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="overflow-x-auto custom-scrollbar pt-4 pb-2">
          <div className="relative min-w-[700px] h-48 flex items-end gap-2 border-b border-slate-800 px-2">
            {/* Target 8h dashed line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-rose-500/60 z-10 pointer-events-none flex items-center justify-end pr-2"
              style={{ bottom: `${(targetSleepHours / 12) * 100}%` }}
            >
              <span className="text-[10px] font-semibold text-rose-400 bg-slate-900 px-1 rounded -translate-y-1/2">
                Target ({targetSleepHours}h)
              </span>
            </div>

            {/* Bars for every day */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(currentYear, currentMonth, day);
              const log = sleepLogs[dateKey];
              const hours = log?.hours || 0;
              const heightPercent = Math.min(100, Math.max(0, (hours / 12) * 100));
              const colors = getSleepColor(hours);
              const isTodayBar =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  key={`bar-${day}`}
                  onClick={() => onOpenSleepModal(dateKey)}
                  className="flex-1 min-w-[18px] sm:min-w-[22px] h-full flex flex-col items-center justify-end group cursor-pointer"
                  title={`Day ${day}: ${hours > 0 ? `${hours} hrs` : 'No data logged'}`}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg border border-slate-700">
                    Day {day}: {hours}h {log?.quality ? `(★${log.quality})` : ''}
                  </div>

                  {/* Value label */}
                  {hours > 0 && (
                    <span
                      className={`text-[9px] font-bold tabular-nums mb-1 transition-transform group-hover:scale-110 ${colors.text}`}
                    >
                      {hours}
                    </span>
                  )}

                  {/* Bar pillar */}
                  <div
                    className={`w-full rounded-t-md transition-all group-hover:brightness-125 ${
                      hours > 0 ? colors.bar : 'bg-slate-800/40 h-1.5'
                    }`}
                    style={{ height: hours > 0 ? `${heightPercent}%` : '4px' }}
                  />

                  {/* Day label */}
                  <span
                    className={`text-[10px] mt-2 font-mono tabular-nums ${
                      isTodayBar ? 'text-rose-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
