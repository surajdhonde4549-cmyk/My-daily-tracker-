import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Check,
  Search,
  Plus,
  Flame,
  Filter,
} from 'lucide-react';
import { Habit, HabitCompletions, HabitCategory } from '../types';
import {
  WEEKDAYS,
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDateKey,
  isSameDay,
} from '../utils/date';
import { HABIT_ICONS, COLOR_THEMES } from '../utils/icons';

interface HabitMatrixProps {
  habits: Habit[];
  completions: HabitCompletions;
  currentMonth: number;
  currentYear: number;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({
  habits,
  completions,
  currentMonth,
  currentYear,
  onToggleHabit,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = new Date();

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || h.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCellClick = (habitId: string, dateKey: string) => {
    const cellKey = `${habitId}_${dateKey}`;
    setAnimatingKey(cellKey);
    setTimeout(() => setAnimatingKey(null), 300);
    onToggleHabit(habitId, dateKey);
  };

  // Helper to calculate habit streak in current month
  const getHabitStreak = (habitId: string): number => {
    let streak = 0;
    const isCurrent =
      today.getFullYear() === currentYear && today.getMonth() === currentMonth;
    const startDay = isCurrent ? today.getDate() : daysInMonth;

    for (let day = startDay; day >= 1; day--) {
      const dateKey = formatDateKey(currentYear, currentMonth, day);
      if (completions[`${habitId}_${dateKey}`]) {
        streak++;
      } else {
        if (day === startDay && isCurrent) {
          // If today isn't done yet, check if yesterday was done
          continue;
        }
        break;
      }
    }
    return streak;
  };

  // Helper to calculate total completed for a day across filtered habits
  const getDayTotal = (day: number): { completed: number; total: number } => {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    let completed = 0;
    filteredHabits.forEach((h) => {
      if (completions[`${h.id}_${dateKey}`]) completed++;
    });
    return { completed, total: filteredHabits.length };
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-3 sm:p-5 shadow-xl shadow-slate-950/40">
      {/* Top Controls: Search, Category Filters, Add Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Habit Matrix</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredHabits.length} {filteredHabits.length === 1 ? 'Habit' : 'Habits'}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-x-auto no-scrollbar">
            {(['all', 'health', 'fitness', 'mind', 'productivity', 'sleep'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Habit CTA */}
          <button
            onClick={onAddHabit}
            className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-rose-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Main Table Matrix */}
      {filteredHabits.length === 0 ? (
        <div className="py-14 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-3 text-rose-400">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-base font-semibold text-slate-200">
            {habits.length === 0 ? 'No habits added yet' : 'No habits match your filter'}
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {habits.length === 0
              ? 'Start building positive daily momentum by adding your first habit.'
              : 'Try clearing the search query or selecting "All" categories.'}
          </p>
          {habits.length === 0 ? (
            <button
              onClick={onAddHabit}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-lg shadow-rose-500/30"
            >
              Add First Habit
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar border border-slate-800/80 rounded-xl bg-slate-950/60">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              {/* Row 1: Weekday Initial Header */}
              <tr className="border-b border-slate-800/80 bg-slate-900/90 text-[11px] font-semibold">
                <th className="sticky left-0 z-20 bg-slate-900/95 px-3 py-2 text-slate-400 min-w-[200px] sm:min-w-[230px] border-r border-slate-800/80 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                  Habit &amp; Streak
                </th>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayOfWeek = (firstDay + day - 1) % 7;
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isTodayCol =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  return (
                    <th
                      key={`wd-${day}`}
                      className={`px-1 py-1.5 text-center min-w-[34px] font-semibold text-[10px] ${
                        isTodayCol
                          ? 'text-rose-400 bg-rose-500/10'
                          : isWeekend
                          ? 'text-rose-400/80'
                          : 'text-slate-400'
                      }`}
                    >
                      {WEEKDAYS[dayOfWeek].slice(0, 1)}
                    </th>
                  );
                })}
              </tr>

              {/* Row 2: Day of Month Number Header */}
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[10px]">
                <th className="sticky left-0 z-20 bg-slate-900/95 px-3 py-1.5 text-slate-500 border-r border-slate-800/80 shadow-[2px_0_5px_rgba(0,0,0,0.3)] font-medium">
                  Days
                </th>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isTodayCol =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  return (
                    <th
                      key={`dn-${day}`}
                      className={`px-1 py-1 text-center min-w-[34px] font-mono tabular-nums ${
                        isTodayCol
                          ? 'text-white font-bold bg-rose-500/20'
                          : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          isTodayCol ? 'bg-rose-500 text-white font-bold' : ''
                        }`}
                      >
                        {day}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredHabits.map((habit) => {
                const IconComponent = HABIT_ICONS[habit.icon] || HABIT_ICONS.check;
                const theme = COLOR_THEMES[habit.color] || COLOR_THEMES.rose;
                const streak = getHabitStreak(habit.id);

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Sticky Habit Header Info */}
                    <td className="sticky left-0 z-10 bg-slate-950/95 px-3 py-2.5 border-r border-slate-800/80 shadow-[2px_0_5px_rgba(0,0,0,0.3)] min-w-[200px] sm:min-w-[230px]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${theme.bg} ${theme.border} border`}
                          >
                            <IconComponent className={`w-3.5 h-3.5 ${theme.text}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-100 truncate text-xs sm:text-sm">
                              {habit.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span className="capitalize">{habit.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold tabular-nums">
                                <Flame className="w-2.5 h-2.5" />
                                {streak}d
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Habit Action Buttons (Edit / Delete) - Permanently visible for easy tap & click */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditHabit(habit);
                            }}
                            title="Edit habit"
                            aria-label={`Edit ${habit.name}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteHabit(habit);
                            }}
                            title="Delete habit"
                            aria-label={`Delete ${habit.name}`}
                            className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Day Checkboxes */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateKey = formatDateKey(currentYear, currentMonth, day);
                      const isCompleted = !!completions[`${habit.id}_${dateKey}`];
                      const isTodayCol =
                        day === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear();
                      const isFuture =
                        currentYear === today.getFullYear() &&
                        currentMonth === today.getMonth() &&
                        day > today.getDate();

                      const isAnimating = animatingKey === `${habit.id}_${dateKey}`;

                      return (
                        <td
                          key={dateKey}
                          className={`px-1 py-1.5 text-center ${
                            isTodayCol ? 'bg-rose-500/5' : ''
                          }`}
                        >
                          <button
                            onClick={() => handleCellClick(habit.id, dateKey)}
                            disabled={isFuture}
                            title={`${habit.name} on ${currentMonth + 1}/${day}`}
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all ${
                              isFuture
                                ? 'opacity-20 cursor-not-allowed bg-slate-900 border border-slate-800'
                                : isCompleted
                                ? `${theme.active} shadow-sm shadow-emerald-500/20 active:scale-90`
                                : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 active:scale-95'
                            } ${isAnimating ? 'animate-pulse-success' : ''}`}
                            aria-label={`Toggle ${habit.name} on day ${day}`}
                          >
                            {isCompleted && (
                              <Check className="w-4 h-4 stroke-[3] text-current" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Summary Row */}
              <tr className="bg-slate-900/80 border-t border-slate-800/80 font-semibold text-[10px]">
                <td className="sticky left-0 z-10 bg-slate-900/95 px-3 py-2 text-slate-400 border-r border-slate-800/80 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                  Daily Completion
                </td>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const { completed, total } = getDayTotal(day);
                  const isAllDone = total > 0 && completed === total;
                  const isTodayCol =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  return (
                    <td
                      key={`total-${day}`}
                      className={`px-1 py-2 text-center tabular-nums ${
                        isTodayCol ? 'bg-rose-500/10' : ''
                      }`}
                    >
                      <span
                        className={`inline-block text-[10px] ${
                          isAllDone
                            ? 'text-emerald-400 font-bold'
                            : completed > 0
                            ? 'text-slate-300'
                            : 'text-slate-600'
                        }`}
                      >
                        {completed}/{total}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
