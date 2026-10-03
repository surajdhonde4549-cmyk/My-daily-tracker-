import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Habit } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  habit,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-center text-white mb-1">
          Delete Habit?
        </h3>
        <p className="text-xs text-center text-slate-400 mb-4 px-2">
          Are you sure you want to delete <span className="text-slate-200 font-semibold">"{habit.name}"</span>? All completion records for this habit will be permanently removed.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all active:scale-95"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
};
