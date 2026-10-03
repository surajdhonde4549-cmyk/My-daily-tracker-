import React, { useState, useEffect } from 'react';
import { Habit, HabitCompletions, SleepData, SleepLog, Note, AppData } from './types';
import {
  INITIAL_HABITS,
  generateInitialCompletions,
  generateInitialSleepLogs,
  generateInitialNotes,
} from './data/initialData';
import { formatDateKey } from './utils/date';
import {
  playCheckSound,
  playUncheckSound,
  playCelebrationSound,
  playSleepSaveSound,
} from './utils/sound';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { HabitMatrix } from './components/HabitMatrix';
import { TodayChecklist } from './components/TodayChecklist';
import { SleepStudio } from './components/SleepStudio';
import { AnalyticsSynergy } from './components/AnalyticsSynergy';
import { NotesSection } from './components/NotesSection';
import { HabitModal } from './components/HabitModal';
import { SleepModal } from './components/SleepModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DataBackupModal } from './components/DataBackupModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const STORAGE_KEY = 'somna_habit_tracker_v2';

export default function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletions>({});
  const [sleepLogs, setSleepLogs] = useState<SleepData>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [targetSleepHours, setTargetSleepHours] = useState<number>(8.0);

  const [activeTab, setActiveTab] = useState<'matrix' | 'today' | 'sleep' | 'analytics'>('matrix');

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [sleepModalDateKey, setSleepModalDateKey] = useState<string | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AppData = JSON.parse(saved);
        setHabits(parsed.habits || []);
        setCompletions(parsed.completions || {});
        setSleepLogs(parsed.sleepLogs || {});
        setNotes(parsed.notes || generateInitialNotes());
        if (parsed.settings) {
          setSoundEnabled(parsed.settings.soundEnabled ?? true);
          setTargetSleepHours(parsed.settings.targetSleepHours ?? 8.0);
        }
      } else {
        // Initialize with realistic initial dataset
        const initialHabits = INITIAL_HABITS;
        const initialCompletions = generateInitialCompletions(initialHabits);
        const initialSleep = generateInitialSleepLogs();
        const initialNotes = generateInitialNotes();

        setHabits(initialHabits);
        setCompletions(initialCompletions);
        setSleepLogs(initialSleep);
        setNotes(initialNotes);
      }
    } catch {
      // fallback
      setHabits(INITIAL_HABITS);
      setCompletions(generateInitialCompletions(INITIAL_HABITS));
      setSleepLogs(generateInitialSleepLogs());
      setNotes(generateInitialNotes());
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (habits.length > 0 || Object.keys(completions).length > 0 || notes.length > 0) {
      const dataToSave: AppData = {
        habits,
        completions,
        sleepLogs,
        notes,
        settings: {
          soundEnabled,
          targetSleepHours,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [habits, completions, sleepLogs, notes, soundEnabled, targetSleepHours]);

  // Handlers
  const handleToggleHabit = (habitId: string, dateKey: string) => {
    const key = `${habitId}_${dateKey}`;
    const willBeDone = !completions[key];

    if (willBeDone) {
      playCheckSound(soundEnabled);
    } else {
      playUncheckSound(soundEnabled);
    }

    setCompletions((prev) => {
      const updated = { ...prev };
      if (willBeDone) {
        updated[key] = true;
      } else {
        delete updated[key];
      }
      return updated;
    });
  };

  const handleSaveHabit = (
    habitData: Omit<Habit, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setHabits((prev) =>
        prev.map((h) => (h.id === existingId ? { ...h, ...habitData } : h))
      );
    } else {
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      setHabits((prev) => [...prev, newHabit]);
    }
  };

  const handleDeleteHabitConfirm = () => {
    if (!habitToDelete) return;
    const targetId = habitToDelete.id;

    // Remove habit
    setHabits((prev) => prev.filter((h) => h.id !== targetId));

    // Remove all completions for this habit
    setCompletions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (k.startsWith(`${targetId}_`)) {
          delete updated[k];
        }
      });
      return updated;
    });

    setHabitToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleSaveSleep = (dateKey: string, log: SleepLog) => {
    playSleepSaveSound(soundEnabled);
    setSleepLogs((prev) => ({
      ...prev,
      [dateKey]: log,
    }));
  };

  const handleDeleteSleep = (dateKey: string) => {
    setSleepLogs((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });
  };

  // Notes Handlers
  const handleSaveNote = (
    noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
    existingId?: string
  ) => {
    const nowIso = new Date().toISOString();
    if (existingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === existingId
            ? { ...n, ...noteData, updatedAt: nowIso }
            : n
        )
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleTogglePinNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleRestoreDemo = () => {
    const newHabits = INITIAL_HABITS;
    const newCompletions = generateInitialCompletions(newHabits);
    const newSleep = generateInitialSleepLogs();
    const newNotes = generateInitialNotes();

    setHabits(newHabits);
    setCompletions(newCompletions);
    setSleepLogs(newSleep);
    setNotes(newNotes);
  };

  const handleImportData = (data: AppData) => {
    setHabits(data.habits || []);
    setCompletions(data.completions || {});
    setSleepLogs(data.sleepLogs || {});
    setNotes(data.notes || []);
    if (data.settings) {
      setSoundEnabled(data.settings.soundEnabled ?? true);
      setTargetSleepHours(data.settings.targetSleepHours ?? 8.0);
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const todaySleep = sleepLogs[todayKey];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col pb-20 md:pb-10">
      {/* Top Header */}
      <Header
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onAddHabit={() => {
          setHabitToEdit(null);
          setIsHabitModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5">
        {/* Top High-Impact Stats Bar */}
        <StatsBar
          habits={habits}
          completions={completions}
          sleepLogs={sleepLogs}
          currentMonth={currentMonth}
          currentYear={currentYear}
          targetSleepHours={targetSleepHours}
        />

        {/* View Content based on activeTab */}
        {activeTab === 'matrix' && (
          <HabitMatrix
            habits={habits}
            completions={completions}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onToggleHabit={handleToggleHabit}
            onAddHabit={() => {
              setHabitToEdit(null);
              setIsHabitModalOpen(true);
            }}
            onEditHabit={(habit) => {
              setHabitToEdit(habit);
              setIsHabitModalOpen(true);
            }}
            onDeleteHabit={(habit) => {
              setHabitToDelete(habit);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {activeTab === 'today' && (
          <TodayChecklist
            habits={habits}
            completions={completions}
            todaySleepLog={todaySleep}
            onToggleHabit={handleToggleHabit}
            onOpenSleepModal={(dateKey) => {
              setSleepModalDateKey(dateKey);
              setIsSleepModalOpen(true);
            }}
            onAddHabit={() => {
              setHabitToEdit(null);
              setIsHabitModalOpen(true);
            }}
            onEditHabit={(habit) => {
              setHabitToEdit(habit);
              setIsHabitModalOpen(true);
            }}
            onDeleteHabit={(habit) => {
              setHabitToDelete(habit);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepStudio
            sleepLogs={sleepLogs}
            currentMonth={currentMonth}
            currentYear={currentYear}
            targetSleepHours={targetSleepHours}
            onOpenSleepModal={(dateKey) => {
              setSleepModalDateKey(dateKey);
              setIsSleepModalOpen(true);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSynergy
            habits={habits}
            completions={completions}
            sleepLogs={sleepLogs}
            currentMonth={currentMonth}
            currentYear={currentYear}
            targetSleepHours={targetSleepHours}
          />
        )}

        {/* Daily & General Notes Section ("Niche notes banane ke liye option") */}
        <NotesSection
          notes={notes}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
          onTogglePin={handleTogglePinNote}
        />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        habitToEdit={habitToEdit}
        onClose={() => {
          setIsHabitModalOpen(false);
          setHabitToEdit(null);
        }}
        onSave={handleSaveHabit}
        onDeleteHabit={(habit) => {
          setHabitToDelete(habit);
          setIsDeleteModalOpen(true);
        }}
      />

      <SleepModal
        isOpen={isSleepModalOpen}
        dateKey={sleepModalDateKey}
        initialLog={sleepModalDateKey ? sleepLogs[sleepModalDateKey] : undefined}
        targetSleepHours={targetSleepHours}
        onClose={() => {
          setIsSleepModalOpen(false);
          setSleepModalDateKey(null);
        }}
        onSave={handleSaveSleep}
        onDelete={handleDeleteSleep}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        habit={habitToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHabitToDelete(null);
        }}
        onConfirm={handleDeleteHabitConfirm}
      />

      <DataBackupModal
        isOpen={isBackupModalOpen}
        currentData={{
          habits,
          completions,
          sleepLogs,
          notes,
          settings: { soundEnabled, targetSleepHours },
        }}
        onClose={() => setIsBackupModalOpen(false)}
        onRestoreDemo={handleRestoreDemo}
        onImportData={handleImportData}
      />
    </div>
  );
}

