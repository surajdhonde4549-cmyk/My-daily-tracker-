import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Search,
  Check,
  Calendar,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Note, NoteCategory } from '../types';
import { formatDateKey, MONTH_NAMES } from '../utils/date';

interface NotesSectionProps {
  notes: Note[];
  onSaveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

const NOTE_CATEGORIES: { id: NoteCategory; label: string; color: string }[] = [
  { id: 'reflection', label: 'Reflection', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'habits', label: 'Habits', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'sleep', label: 'Sleep & Rest', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'wins', label: 'Wins & Gratitude', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'general', label: 'General', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
];

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const today = new Date();
  const defaultDate = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('reflection');
  const [date, setDate] = useState(defaultDate);
  const [isPinned, setIsPinned] = useState(false);
  const [formError, setFormError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setDate(note.date);
    setIsPinned(!!note.isPinned);
    setIsAdding(true);
    setFormError('');
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('reflection');
    setDate(defaultDate);
    setIsPinned(false);
    setEditingId(null);
    setIsAdding(false);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setFormError('Please enter a note title or content');
      return;
    }

    onSaveNote(
      {
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        category,
        date,
        isPinned,
      },
      editingId || undefined
    );

    resetForm();
  };

  // Sort notes: pinned first, then newest date/createdAt first
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredNotes = sortedNotes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || n.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="notes-section" className="mt-8 pt-6 border-t border-slate-800/80 scroll-mt-20">
      {/* Section Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-xl shadow-slate-950/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-rose-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Daily Notes &amp; Reflections</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Record your daily thoughts, sleep insights, routine adjustments, and habit breakthroughs.
              </p>
            </div>
          </div>

          {!isAdding && (
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/25 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          )}
        </div>

        {/* Note Creation / Editing Card Form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>{editingId ? 'Edit Note' : 'New Note / Reflection'}</span>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Sleep & Morning Meditation Reflections..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-rose-500 placeholder-slate-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Note Category */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {NOTE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      category === cat.id
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Note Details &amp; Thoughts
              </label>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (formError) setFormError('');
                }}
                rows={4}
                placeholder="Write your observations, what worked well, what caused friction, dream notes, or ideas..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-rose-500 placeholder-slate-500 resize-y"
              />
            </div>

            {formError && <p className="text-xs text-rose-400">{formError}</p>}

            {/* Form Footer Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPinned((v) => !v)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isPinned
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{isPinned ? 'Pinned to top' : 'Pin to top'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/25 transition-all active:scale-95"
                >
                  {editingId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter and Search Bar for Notes */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Notes
            </button>
            {NOTE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  selectedFilter === cat.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="py-10 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <div className="text-sm font-semibold text-slate-300">No notes found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
              {notes.length === 0
                ? 'Capture what you noticed about your sleep, mood, energy levels, or habit milestones.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            {notes.length === 0 && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow"
              >
                Write First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredNotes.map((note) => {
              const categoryMeta =
                NOTE_CATEGORIES.find((c) => c.id === note.category) || NOTE_CATEGORIES[0];

              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    note.isPinned
                      ? 'bg-slate-950/90 border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Note Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryMeta.color}`}
                        >
                          {categoryMeta.label}
                        </span>
                        {note.isPinned && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                            <Pin className="w-3 h-3 fill-amber-400" />
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>

                      {/* Card Action Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onTogglePin(note.id)}
                          title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            note.isPinned
                              ? 'text-amber-400 hover:bg-slate-800'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          title="Edit note"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.id)}
                          title="Delete note"
                          className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Note Title */}
                    <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight line-clamp-1">
                      {note.title}
                    </h3>

                    {/* Note Content */}
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {note.content}
                    </p>
                  </div>

                  {/* Note Footer Date */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{note.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
