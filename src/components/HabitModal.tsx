import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { Habit, HabitCategory, HabitColor } from '../types';
import { HABIT_ICONS, COLOR_THEMES } from '../utils/icons';

interface HabitModalProps {
  isOpen: boolean;
  habitToEdit?: Habit | null;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt'>, existingId?: string) => void;
  onDeleteHabit?: (habit: Habit) => void;
}


const CATEGORIES: { id: HabitCategory; label: string }[] = [
  { id: 'health', label: 'Health' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'mind', label: 'Mindfulness' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'sleep', label: 'Sleep Hygiene' },
  { id: 'other', label: 'General' },
];

const COLORS: { id: HabitColor; label: string; bg: string }[] = [
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
];

const ICON_KEYS = Object.keys(HABIT_ICONS);

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  habitToEdit,
  onClose,
  onSave,
  onDeleteHabit,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [color, setColor] = useState<HabitColor>('rose');
  const [icon, setIcon] = useState('check');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setCategory(habitToEdit.category);
      setColor(habitToEdit.color);
      setIcon(habitToEdit.icon);
      setFrequency(habitToEdit.frequency);
    } else {
      setName('');
      setCategory('health');
      setColor('rose');
      setIcon('check');
      setFrequency('daily');
    }
    setError('');
  }, [habitToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a habit name');
      return;
    }

    onSave(
      {
        name: name.trim(),
        category,
        color,
        icon,
        frequency,
      },
      habitToEdit ? habitToEdit.id : undefined
    );
    onClose();
  };

  const SelectedIcon = HABIT_ICONS[icon] || HABIT_ICONS.check;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Habit Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Habit Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Morning 10m Meditation, 2L Water"
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-rose-500 placeholder-slate-500"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    category === cat.id
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Target Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekdays', 'weekends'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all capitalize ${
                    frequency === freq
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all ${
                    color === c.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Habit Icon
            </label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {ICON_KEYS.map((k) => {
                const IconItem = HABIT_ICONS[k];
                const isSelected = icon === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setIcon(k)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <IconItem className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                COLOR_THEMES[color]?.bg || 'bg-rose-500/20'
              } ${COLOR_THEMES[color]?.text || 'text-rose-400'}`}
            >
              <SelectedIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {name || 'Habit Name Preview'}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {category} · {frequency}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            {habitToEdit && onDeleteHabit && (
              <button
                type="button"
                onClick={() => {
                  onDeleteHabit(habitToEdit);
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Delete this habit"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/25 transition-all active:scale-95"
            >
              {habitToEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
