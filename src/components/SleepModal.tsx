import React, { useState, useEffect } from 'react';
import { Moon, Star, X, Plus, Minus, Trash2, Clock, Check } from 'lucide-react';
import { SleepLog } from '../types';
import {
  parseDateKey,
  MONTH_NAMES,
  calculateHoursFromTimes,
  formatDateKey,
} from '../utils/date';

interface SleepModalProps {
  isOpen: boolean;
  dateKey: string | null;
  initialLog?: SleepLog;
  targetSleepHours: number;
  onClose: () => void;
  onSave: (dateKey: string, log: SleepLog) => void;
  onDelete: (dateKey: string) => void;
}

const COMMON_FACTORS = [
  'Exercised',
  'Screen-free 30m',
  'Cool room (18-20°C)',
  'Meditation / Breathwork',
  'Read a book',
  'Late heavy meal',
  'Caffeine after 2 PM',
  'High stress',
  'Alcohol',
  'Travel / Noise',
];

export const SleepModal: React.FC<SleepModalProps> = ({
  isOpen,
  dateKey,
  initialLog,
  targetSleepHours,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !dateKey) return null;

  const { year, month, day } = parseDateKey(dateKey);

  const [hours, setHours] = useState<number>(initialLog?.hours ?? 7.5);
  const [bedtime, setBedtime] = useState<string>(initialLog?.bedtime ?? '23:00');
  const [wakeTime, setWakeTime] = useState<string>(initialLog?.wakeTime ?? '07:00');
  const [quality, setQuality] = useState<number>(initialLog?.quality ?? 4);
  const [notes, setNotes] = useState<string>(initialLog?.notes ?? '');
  const [factors, setFactors] = useState<string[]>(initialLog?.factors ?? []);

  useEffect(() => {
    if (initialLog) {
      setHours(initialLog.hours);
      setBedtime(initialLog.bedtime || '23:00');
      setWakeTime(initialLog.wakeTime || '07:00');
      setQuality(initialLog.quality || 4);
      setNotes(initialLog.notes || '');
      setFactors(initialLog.factors || []);
    } else {
      setHours(7.5);
      setBedtime('23:00');
      setWakeTime('07:00');
      setQuality(4);
      setNotes('');
      setFactors([]);
    }
  }, [initialLog, dateKey]);

  // Adjust duration via +/- 0.5h
  const handleHoursStep = (delta: number) => {
    setHours((prev) => Math.min(16, Math.max(0, Math.round((prev + delta) * 10) / 10)));
  };

  // Recalculate duration when bedtime or wake time change
  const handleTimeChange = (newBed: string, newWake: string) => {
    setBedtime(newBed);
    setWakeTime(newWake);
    const calculated = calculateHoursFromTimes(newBed, newWake);
    if (calculated > 0) {
      setHours(calculated);
    }
  };

  const toggleFactor = (f: string) => {
    setFactors((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const handleSave = () => {
    onSave(dateKey, {
      hours,
      bedtime,
      wakeTime,
      quality,
      notes: notes.trim(),
      factors,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(dateKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Log Sleep Session
              </h3>
              <div className="text-xs text-slate-400">
                {MONTH_NAMES[month]} {day}, {year}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Duration Adjuster */}
        <div className="my-5 text-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Hours of Sleep
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleHoursStep(-0.5)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 flex items-center justify-center font-bold text-lg active:scale-95 transition-all shadow"
              aria-label="Decrease hours"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="w-24 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                {hours}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">hrs</span>
            </div>

            <button
              type="button"
              onClick={() => handleHoursStep(0.5)}
              className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 flex items-center justify-center font-bold text-lg active:scale-95 transition-all shadow"
              aria-label="Increase hours"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bedtime & Wake Time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bedtime</span>
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => handleTimeChange(e.target.value, wakeTime)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Wake Time</span>
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => handleTimeChange(bedtime, e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Rest Quality Rating (1 - 5 Stars) */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 block mb-2">
            Rest Quality Rating
          </label>
          <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-800">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setQuality(star)}
                className="p-1.5 rounded-lg hover:scale-110 transition-transform"
                title={`${star} Star`}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= quality
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Factors multi-select */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Sleep Factors &amp; Influences
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_FACTORS.map((f) => {
              const active = factors.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFactor(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Reflections / Dreams / Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel upon waking? Any interruptions?"
            rows={2}
            className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500 placeholder-slate-500 resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          {initialLog && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              title="Delete sleep record"
            >
              <Trash2 className="w-4 h-4" />
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
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/25 transition-all active:scale-95"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};
