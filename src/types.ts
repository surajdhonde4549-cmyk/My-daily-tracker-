export type HabitCategory = 'health' | 'mind' | 'fitness' | 'productivity' | 'sleep' | 'other';

export type HabitColor = 'rose' | 'emerald' | 'indigo' | 'amber' | 'cyan' | 'purple';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  color: HabitColor;
  frequency: 'daily' | 'weekdays' | 'weekends';
  createdAt: string;
}

export type HabitCompletions = Record<string, boolean>; // key: `${habitId}_${dateKey}`

export interface SleepLog {
  hours: number;
  bedtime?: string;
  wakeTime?: string;
  quality?: number; // 1-5
  notes?: string;
  factors?: string[];
}

export type SleepData = Record<string, SleepLog>; // key: YYYY-MM-DD

export type NoteCategory = 'reflection' | 'habits' | 'sleep' | 'wins' | 'general';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  category: NoteCategory;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  habits: Habit[];
  completions: HabitCompletions;
  sleepLogs: SleepData;
  notes?: Note[];
  settings: {
    soundEnabled: boolean;
    targetSleepHours: number;
  };
}

