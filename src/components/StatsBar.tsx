import React from 'react';
import { CheckCircle2, Flame, Moon, TrendingUp, Sparkles } from 'lucide-react';
import { Habit, HabitCompletions, SleepData } from '../types';
import { getDaysInMonth, formatDateKey } from '../utils/date';

interface StatsBarProps {
  habits: Habit[];
  completions: HabitCompletions;
  sleepLogs: SleepData;
  currentMonth: number;
  currentYear: number;
  targetSleepHours: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  habits,
  completions,
  sleepLogs,
  currentMonth,
  currentYear,
  targetSleepHours,
}) => {
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Calculate habit completions in this month
  let totalCompletions = 0;
  let totalPossible = 0;

  habits.forEach((habit) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentYear, currentMonth, day);
      const isWeekend =
        new Date(currentYear, currentMonth, day).getDay() === 0 ||
        new Date(currentYear, currentMonth, day).getDay() === 6;

      if (habit.frequency === 'weekdays' && isWeekend) continue;
      if (habit.frequency === 'weekends' && !isWeekend) continue;

      totalPossible++;
      if (completions[`${habit.id}_${dateKey}`]) {
        totalCompletions++;
      }
    }
  });

  const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  // Calculate current active streak ending today
  const today = new Date();
  let currentStreak = 0;
  let checkDate = new Date(today);

  // Look back up to 60 days
  for (let i = 0; i < 60; i++) {
    const y = checkDate.getFullYear();
    const m = checkDate.getMonth();
    const d = checkDate.getDate();
    const dateKey = formatDateKey(y, m, d);

    if (habits.length === 0) break;

    // Check if at least 1 habit or majority of applicable habits were completed
    let dayCount = 0;
    let applicableCount = 0;
    const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6;

    habits.forEach((h) => {
      if (h.frequency === 'weekdays' && isWeekend) return;
      if (h.frequency === 'weekends' && !isWeekend) return;
      applicableCount++;
      if (completions[`${h.id}_${dateKey}`]) {
        dayCount++;
      }
    });

    if (applicableCount > 0 && dayCount >= Math.ceil(applicableCount * 0.5)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today is not done yet, we can check if yesterday had a streak
      if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Calculate sleep stats for this month
  let totalSleepHours = 0;
  let loggedDaysCount = 0;
  let qualitySum = 0;
  let qualityCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const log = sleepLogs[dateKey];
    if (log && log.hours > 0) {
      totalSleepHours += log.hours;
      loggedDaysCount++;
      if (log.quality) {
        qualitySum += log.quality;
        qualityCount++;
      }
    }
  }

  const avgSleep = loggedDaysCount > 0 ? (totalSleepHours / loggedDaysCount).toFixed(1) : '—';
  const avgQuality = qualityCount > 0 ? (qualitySum / qualityCount).toFixed(1) : '—';
  const sleepDebtHours = loggedDaysCount > 0
    ? (totalSleepHours - loggedDaysCount * targetSleepHours).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* Stat 1: Habits Done */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Habits Completed
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {totalCompletions}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {totalPossible} target
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Stat 2: Completion Rate */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Completion Rate
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">this month</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* Stat 3: Active Streak */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Current Streak
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-rose-400 tabular-nums">
              {currentStreak}
            </span>
            <span className="text-xs text-slate-500 font-medium">days active</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      {/* Stat 4: Avg Sleep & Quality */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Average Sleep
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-400 tabular-nums">
              {avgSleep}h
            </span>
            {qualityCount > 0 && (
              <span className="text-xs font-semibold text-indigo-300/80">
                ★ {avgQuality}
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
};
