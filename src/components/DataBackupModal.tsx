import React, { useState } from 'react';
import { Download, Upload, RotateCcw, X, Check, AlertCircle } from 'lucide-react';
import { AppData } from '../types';

interface DataBackupModalProps {
  isOpen: boolean;
  currentData: AppData;
  onClose: () => void;
  onRestoreDemo: () => void;
  onImportData: (data: AppData) => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  currentData,
  onClose,
  onRestoreDemo,
  onImportData,
}) => {
  if (!isOpen) return null;

  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `somna-habit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      if (!importJson.trim()) {
        setImportStatus('Please paste valid JSON backup data');
        return;
      }
      const parsed = JSON.parse(importJson);
      if (!parsed.habits || !parsed.completions) {
        throw new Error('Missing required habits or completions fields');
      }
      onImportData(parsed);
      setImportStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setImportStatus('Invalid JSON format. Please verify your backup.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white tracking-tight">
            Data Backup &amp; Management
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Export Tracker Backup</div>
              <div className="text-[11px] text-slate-400">
                Download a JSON backup of all your habits, daily completions, and sleep logs.
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Restore from Backup</span>
            </div>
            <textarea
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value);
                setImportStatus(null);
              }}
              placeholder="Paste exported backup JSON here..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-rose-500 placeholder-slate-500"
            />
            {importStatus && (
              <div
                className={`text-xs ${
                  importStatus === 'success' ? 'text-emerald-400 font-semibold' : 'text-rose-400'
                }`}
              >
                {importStatus === 'success' ? 'Backup restored successfully!' : importStatus}
              </div>
            )}
            <button
              onClick={handleImportSubmit}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow"
            >
              Restore Backup Data
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-rose-300 mb-0.5">Reset to Sample Data</div>
              <div className="text-[11px] text-slate-400">
                Resets habits and sleep records to the curated initial demo dataset.
              </div>
            </div>
            <button
              onClick={() => {
                onRestoreDemo();
                onClose();
              }}
              className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
