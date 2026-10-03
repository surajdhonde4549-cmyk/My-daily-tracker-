import React from 'react';
import {
  Check,
  Flame,
  Plus,
  Moon,
  Sparkles,
  Trophy,
  ArrowRight,
  Trash2,
  Edit2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Habit, HabitCompletions, SleepLog } from '../types';
import { formatDateKey, MONTH_NAMES, WEEKDAYS, formatTimeDisplay } from '../utils/date';
import { HABIT_ICONS, COLOR_THEMES } from '../utils/icons';

interface TodayChecklistProps {
  habits: Habit[];
  completions: HabitCompletions;
  todaySleepLog?: SleepLog;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onOpenSleepModal: (dateKey: string) => void;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
}

export const TodayChecklist: React.FC<TodayChecklistProps> = ({
  habits,
  completions,
  todaySleepLog,
  onToggleHabit,
  onOpenSleepModal,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}) => {

  const today = new Date();
  const dateKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Filter applicable habits for today (daily vs weekdays vs weekends)
  const applicableHabits = habits.filter((h) => {
    if (h.frequency === 'weekdays' && isWeekend) return false;
    if (h.frequency === 'weekends' && !isWeekend) return false;
    return true;
  });

  const completedCount = applicableHabits.filter(
    (h) => completions[`${h.id}_${dateKey}`]
  ).length;

  const totalCount = applicableHabits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  const handleToggle = (habitId: string) => {
    const isCurrentlyDone = !!completions[`${habitId}_${dateKey}`];
    onToggleHabit(habitId, dateKey);

    // If completing the last habit, trigger confetti!
    if (!isCurrentlyDone && completedCount + 1 === totalCount) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left 2 Columns: Today's Habit List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Today's Header Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                {WEEKDAYS[dayOfWeek]}, {MONTH_NAMES[today.getMonth()]} {today.getDate()}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Today's Daily Rituals
              </h2>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                  {completedCount}/{totalCount}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-white">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Celebratory Banner when 100% */}
          {isAllComplete && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs">
                <span className="font-bold">Outstanding achievement!</span> You have conquered all your rituals for today.
              </div>
            </div>
          )}
        </div>

        {/* Habits Checklist */}
        <div className="space-y-2.5">
          {applicableHabits.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-rose-400 opacity-60" />
              <div className="font-semibold text-slate-300 mb-1">No habits scheduled for today</div>
              <button
                onClick={onAddHabit}
                className="mt-3 px-3.5 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition-colors"
              >
                Add a Habit
              </button>
            </div>
          ) : (
            applicableHabits.map((habit) => {
              const isDone = !!completions[`${habit.id}_${dateKey}`];
              const IconComp = HABIT_ICONS[habit.icon] || HABIT_ICONS.check;
              const theme = COLOR_THEMES[habit.color] || COLOR_THEMES.rose;

              return (
                <div
                  key={habit.id}
                  onClick={() => handleToggle(habit.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(habit.id);
                    }
                  }}
                  className={`w-full min-h-[60px] p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-85'
                      : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 shadow-md shadow-slate-950/20 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isDone ? 'bg-slate-800 text-slate-400 border-slate-700' : `${theme.bg} ${theme.border} ${theme.text}`
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Habit Details */}
                    <div className="min-w-0">
                      <div
                        className={`text-sm sm:text-base font-semibold truncate transition-colors ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {habit.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="capitalize">{habit.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{habit.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Habit Controls: Checkbox and Edit/Delete */}
                  <div className="shrink-0 flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditHabit(habit);
                      }}
                      title="Edit habit"
                      aria-label={`Edit ${habit.name}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHabit(habit);
                      }}
                      title="Delete habit"
                      aria-label={`Delete ${habit.name}`}
                      className="p-2 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Big Touch Checkbox (Hitbox >= 44px) */}
                    <div className="flex items-center justify-center min-w-[44px] min-h-[44px] ml-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                            : 'border-2 border-slate-600 hover:border-rose-400 text-transparent'
                        }`}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right 1 Column: Today's Sleep & Motivation */}
      <div className="space-y-4">
        {/* Today's Sleep Quick Widget */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Moon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Today's Sleep</h3>
            </div>
            <button
              onClick={() => onOpenSleepModal(dateKey)}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              {todaySleepLog ? 'Edit' : '+ Log'}
            </button>
          </div>

          {todaySleepLog ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Logged Duration</div>
                  <div className="text-2xl font-extrabold text-indigo-400 tabular-nums">
                    {todaySleepLog.hours} hrs
                  </div>
                </div>
                {todaySleepLog.quality && (
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">Quality</div>
                    <div className="text-sm font-bold text-amber-400">
                      {'★'.repeat(todaySleepLog.quality)}
                      {'☆'.repeat(5 - todaySleepLog.quality)}
                    </div>
                  </div>
                )}
              </div>

              {(todaySleepLog.bedtime || todaySleepLog.wakeTime) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 text-slate-300">
                    <span className="text-slate-500 block text-[10px]">Bedtime</span>
                    <span className="font-semibold">{formatTimeDisplay(todaySleepLog.bedtime) || '—'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 text-slate-300">
                    <span className="text-slate-500 block text-[10px]">Wake-up</span>
                    <span className="font-semibold">{formatTimeDisplay(todaySleepLog.wakeTime) || '—'}</span>
                  </div>
                </div>
              )}

              {todaySleepLog.notes && (
                <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                  "{todaySleepLog.notes}"
                </p>
              )}

              {todaySleepLog.factors && todaySleepLog.factors.length > 0 && (
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
                  {todaySleepLog.factors.map((f, i) => (
                    <span key={i} className="text-slate-400">
                      {f}{i < todaySleepLog.factors!.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 mb-3">
                No sleep recorded for last night yet. Record your rest to calculate insights.
              </p>
              <button
                onClick={() => onOpenSleepModal(dateKey)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                Log Sleep for Last Night
              </button>
            </div>
          )}
        </div>

        {/* Motivational Wisdom Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Momentum Tip</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "We do not rise to the level of our goals; we fall to the level of our systems. Small daily habits compound into extraordinary transformations."
          </p>
        </div>
      </div>
    </div>
  );
};
