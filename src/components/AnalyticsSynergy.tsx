import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Brain,
  Award,
  Zap,
  Calendar,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { Habit, HabitCompletions, SleepData } from '../types';
import {
  getDaysInMonth,
  formatDateKey,
  WEEKDAYS,
  parseDateKey,
} from '../utils/date';
import { HABIT_ICONS, COLOR_THEMES } from '../utils/icons';

interface AnalyticsSynergyProps {
  habits: Habit[];
  completions: HabitCompletions;
  sleepLogs: SleepData;
  currentMonth: number;
  currentYear: number;
  targetSleepHours: number;
}

export const AnalyticsSynergy: React.FC<AnalyticsSynergyProps> = ({
  habits,
  completions,
  sleepLogs,
  currentMonth,
  currentYear,
  targetSleepHours,
}) => {
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // 1. Calculate Sleep-Habit Correlation
  // On day N, compare habit completions of day N with sleep logged for night of N (or previous night)
  let highSleepHabitDone = 0;
  let highSleepHabitTotal = 0;
  let lowSleepHabitDone = 0;
  let lowSleepHabitTotal = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const sleep = sleepLogs[dateKey];
    if (!sleep || sleep.hours <= 0) continue;

    const isHighSleep = sleep.hours >= targetSleepHours;

    habits.forEach((habit) => {
      const isWeekend =
        new Date(currentYear, currentMonth, day).getDay() === 0 ||
        new Date(currentYear, currentMonth, day).getDay() === 6;
      if (habit.frequency === 'weekdays' && isWeekend) return;
      if (habit.frequency === 'weekends' && !isWeekend) return;

      const done = !!completions[`${habit.id}_${dateKey}`];

      if (isHighSleep) {
        highSleepHabitTotal++;
        if (done) highSleepHabitDone++;
      } else {
        lowSleepHabitTotal++;
        if (done) lowSleepHabitDone++;
      }
    });
  }

  const highSleepRate =
    highSleepHabitTotal > 0
      ? Math.round((highSleepHabitDone / highSleepHabitTotal) * 100)
      : 0;

  const lowSleepRate =
    lowSleepHabitTotal > 0
      ? Math.round((lowSleepHabitDone / lowSleepHabitTotal) * 100)
      : 0;

  const synergyBoost = highSleepRate - lowSleepRate;

  // 2. Day of Week Habit Completion Performance
  const dayOfWeekStats: { completed: number; total: number }[] = Array.from(
    { length: 7 },
    () => ({ completed: 0, total: 0 })
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    const dow = d.getDay();
    const dateKey = formatDateKey(currentYear, currentMonth, day);

    habits.forEach((habit) => {
      const isWeekend = dow === 0 || dow === 6;
      if (habit.frequency === 'weekdays' && isWeekend) return;
      if (habit.frequency === 'weekends' && !isWeekend) return;

      dayOfWeekStats[dow].total++;
      if (completions[`${habit.id}_${dateKey}`]) {
        dayOfWeekStats[dow].completed++;
      }
    });
  }

  // 3. Habit-by-Habit Ranking
  const habitRankings = habits.map((habit) => {
    let completed = 0;
    let possible = 0;
    let maxStreak = 0;
    let currentStreakCounter = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentYear, currentMonth, day);
      const isWeekend =
        new Date(currentYear, currentMonth, day).getDay() === 0 ||
        new Date(currentYear, currentMonth, day).getDay() === 6;

      if (habit.frequency === 'weekdays' && isWeekend) continue;
      if (habit.frequency === 'weekends' && !isWeekend) continue;

      possible++;
      if (completions[`${habit.id}_${dateKey}`]) {
        completed++;
        currentStreakCounter++;
        if (currentStreakCounter > maxStreak) {
          maxStreak = currentStreakCounter;
        }
      } else {
        currentStreakCounter = 0;
      }
    }

    const rate = possible > 0 ? Math.round((completed / possible) * 100) : 0;
    return {
      habit,
      completed,
      possible,
      rate,
      maxStreak,
    };
  });

  habitRankings.sort((a, b) => b.rate - a.rate);

  return (
    <div className="space-y-6">
      {/* Synergy Showcase Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 rounded-2xl border border-indigo-900/50 p-5 sm:p-7 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lifestyle Synergy Analysis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              Sleep Duration vs. Habit Success
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {highSleepHabitTotal > 0 && lowSleepHabitTotal > 0 ? (
                <>
                  On days with optimal sleep (≥{targetSleepHours} hrs), your habit completion rate is{' '}
                  <span className="font-bold text-emerald-400">{highSleepRate}%</span> compared to{' '}
                  <span className="font-bold text-rose-400">{lowSleepRate}%</span> on low sleep days.{' '}
                  {synergyBoost > 0 ? (
                    <span className="text-indigo-300 font-semibold">
                      That is a +{synergyBoost}% productivity advantage gained from restorative sleep!
                    </span>
                  ) : (
                    'Keep tracking both variables to reveal longer-term lifestyle correlations.'
                  )}
                </>
              ) : (
                'Track at least a few days of both habits and sleep to unlock your personalized empirical synergy rating!'
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-around sm:justify-start">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-center min-w-[120px]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Well-Rested (≥{targetSleepHours}h)
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
                {highSleepRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {highSleepHabitDone} of {highSleepHabitTotal} rituals
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center min-w-[120px]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Sleep-Deficit (&lt;{targetSleepHours}h)
              </div>
              <div className="text-3xl font-extrabold text-rose-400 tabular-nums">
                {lowSleepRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {lowSleepHabitDone} of {lowSleepHabitTotal} rituals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Consistency Rankings & Day of Week Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Habit Consistency Rankings */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Habit Consistency Ranking</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">This Month</span>
          </div>

          {habitRankings.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No habits added yet</p>
          ) : (
            <div className="space-y-3">
              {habitRankings.map((item, index) => {
                const IconComp = HABIT_ICONS[item.habit.icon] || HABIT_ICONS.check;
                const theme = COLOR_THEMES[item.habit.color] || COLOR_THEMES.rose;

                return (
                  <div
                    key={item.habit.id}
                    className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-extrabold text-xs text-slate-500 w-4 text-center">
                        #{index + 1}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${theme.bg} ${theme.border} ${theme.text}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                          {item.habit.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="capitalize">{item.habit.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Best streak: {item.maxStreak}d
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-emerald-400 tabular-nums">
                        {item.rate}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.completed}/{item.possible}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Day of Week Rhythm */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Weekly Discipline Rhythm</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">By Day of Week</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {WEEKDAYS.map((name, dow) => {
              const stats = dayOfWeekStats[dow];
              const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              const isWeekend = dow === 0 || dow === 6;

              return (
                <div key={name} className="flex items-center gap-3 text-xs">
                  <span
                    className={`w-10 font-bold ${
                      isWeekend ? 'text-rose-400' : 'text-slate-300'
                    }`}
                  >
                    {name}
                  </span>

                  <div className="flex-1 bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rate >= 80
                          ? 'bg-emerald-400'
                          : rate >= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-extrabold tabular-nums text-slate-200">
                    {rate}%
                  </span>
                  <span className="w-14 text-right text-[10px] text-slate-500 tabular-nums">
                    ({stats.completed}/{stats.total})
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <span className="font-semibold text-slate-300">Observation:</span> Understanding which days of the week have the lowest adherence allows you to adjust friction, schedule easier micro-habits, or protect your time proactively.
          </div>
        </div>
      </div>
    </div>
  );
};
