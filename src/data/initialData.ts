import { Habit, HabitCompletions, SleepData } from '../types';
import { formatDateKey, getDaysInMonth } from '../utils/date';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-water',
    name: 'Morning Hydration (500ml)',
    category: 'health',
    icon: 'droplets',
    color: 'cyan',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-exercise',
    name: '30 Min Workout / Brisk Walk',
    category: 'fitness',
    icon: 'dumbbell',
    color: 'emerald',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-reading',
    name: 'Read 15 Pages',
    category: 'mind',
    icon: 'book',
    color: 'indigo',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-focus',
    name: 'Deep Work Block (90m)',
    category: 'productivity',
    icon: 'zap',
    color: 'amber',
    frequency: 'weekdays',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-screen-free',
    name: 'Screen-Free 30m Before Bed',
    category: 'sleep',
    icon: 'moon',
    color: 'rose',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
  },
];

export function generateInitialCompletions(habits: Habit[] = INITIAL_HABITS): HabitCompletions {
  const completions: HabitCompletions = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayOfMonth = today.getDate();

  habits.forEach((habit, hIdx) => {
    // Generate realistic streaks for past days of current month up to today
    for (let day = 1; day <= dayOfMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;
      
      // Calculate a realistic completion probability
      let completed = false;
      const seed = (day * 13 + hIdx * 7) % 10;

      if (habit.frequency === 'weekdays' && isWeekend) {
        completed = false;
      } else {
        // High consistency for last 5 days, varied before
        if (day >= dayOfMonth - 4) {
          completed = seed > 1; // 80% completion in recent days
        } else {
          completed = seed > 2; // ~70% completion
        }
      }

      if (completed) {
        completions[`${habit.id}_${dateKey}`] = true;
      }
    }
  });

  return completions;
}

export function generateInitialSleepLogs(): SleepData {
  const sleepLogs: SleepData = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayOfMonth = today.getDate();

  const factorOptions = [
    ['Exercised', 'Cool room'],
    ['Caffeine late', 'Screen time'],
    ['Meditation', 'Quiet night'],
    ['Reading', 'Cool room'],
    ['Late meal', 'Stress'],
    ['Quiet night', 'Exercised'],
  ];

  for (let day = 1; day <= dayOfMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    // Typical sleep distribution between 6.5 and 8.8 hours
    const baseHour = 7.0;
    const variance = ((day * 7) % 5) * 0.5 - 0.5; // -0.5, 0, 0.5, 1.0, 1.5
    const hours = Math.min(9.5, Math.max(5.5, Math.round((baseHour + variance) * 10) / 10));

    let quality = 4;
    if (hours >= 7.5) quality = 5;
    else if (hours >= 6.5) quality = 4;
    else if (hours >= 6.0) quality = 3;
    else quality = 2;

    const factors = factorOptions[day % factorOptions.length];

    sleepLogs[dateKey] = {
      hours,
      bedtime: '23:15',
      wakeTime: hours >= 8 ? '07:30' : '06:45',
      quality,
      notes: hours >= 8 ? 'Woke up energized and rested' : hours < 6.5 ? 'Restless early morning awakening' : 'Solid restorative sleep',
      factors,
    };
  }

  return sleepLogs;
}

export function generateInitialNotes() {
  const today = new Date();
  const dateKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return [
    {
      id: 'note-sample-1',
      title: 'Evening Wind-Down & Sleep Routine',
      content: 'Drinking chamomile tea and reading 15 pages without checking notifications significantly improved deep sleep score from 3 to 5 stars. Keep room temperature at 19°C.',
      date: dateKey,
      category: 'sleep' as const,
      isPinned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'note-sample-2',
      title: 'Weekly Habit Momentum Observations',
      content: 'Morning hydration + quick outdoor walk creates high focus momentum for the rest of the day. Tuesday was my highest productivity day with all 5 rituals completed!',
      date: dateKey,
      category: 'habits' as const,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

