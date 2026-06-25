import React, { useState, useEffect } from 'react';
import { taskService, noteService } from '../services/api';
import { useToast } from '../components/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TaskModal from '../components/TaskModal';
import NoteModal from '../components/NoteModal';
import {
  SearchBar,
  FilterPanel,
  RecentSearches,
  SearchText,
  TagBadge
} from '../components';
import {
  FiCheckSquare,
  FiSquare,
  FiCalendar,
  FiClock,
  FiTag,
  FiEdit3,
  FiTrash2,
  FiFileText,
  FiLoader,
  FiGrid
} from 'react-icons/fi';

const Search = () => {
  const { showToast } = useToast();

  // Search input and filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [dueDate, setDueDate] = useState('');

  // Results state
  const [results, setResults] = useState({ tasks: [], notes: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'tasks', 'notes'

  // Modals state
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Local storage for last 10 searches
  const [recentSearches, setRecentSearches] = useLocalStorage('recent_searches', []);

  // Fetch search results from backend
  const fetchSearchResults = async (queryText = searchQuery) => {
    try {
      setLoading(true);
      const params = {
        q: queryText,
        category,
        status,
        priority,
        due_date: dueDate
      };

      const res = await taskService.search(params);
      if (res.success) {
        setResults(res.data);

        // Add to recent searches if search text is not empty
        if (queryText.trim()) {
          setRecentSearches((prev) => {
            const cleaned = queryText.trim();
            const filtered = prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase());
            return [cleaned, ...filtered].slice(0, 10);
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Search request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Perform search automatically when filters or tab changes
  useEffect(() => {
    fetchSearchResults();
  }, [category, status, priority, dueDate]);

  // Form search submission handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchSearchResults();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchSearchResults('');
  };

  const handleSelectRecentQuery = (query) => {
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const handleRemoveRecentQuery = (query) => {
    setRecentSearches((prev) => prev.filter((q) => q !== query));
  };

  const handleClearRecentQueries = () => {
    setRecentSearches([]);
  };

  const handleResetFilters = () => {
    setCategory('All');
    setStatus('All');
    setPriority('All');
    setDueDate('');
  };

  // Tasks actions
  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskService.complete(taskId);
      if (res.success) {
        showToast('Task marked as completed!', 'success');
        fetchSearchResults();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to complete task.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await taskService.delete(taskId);
      if (res.success) {
        showToast('Task deleted successfully.', 'success');
        fetchSearchResults();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete task.', 'error');
    }
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      const res = await taskService.update(editingTask.id, taskData);
      if (res.success) {
        showToast('Task updated successfully!', 'success');
        setIsTaskModalOpen(false);
        fetchSearchResults();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update task.', 'error');
    }
  };

  // Notes actions
  const handleOpenEditNote = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await noteService.delete(noteId);
      if (res.success) {
        showToast('Note deleted successfully.', 'success');
        fetchSearchResults();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete note.', 'error');
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      const res = await noteService.update(editingNote.id, noteData);
      if (res.success) {
        showToast('Note updated successfully!', 'success');
        setIsNoteModalOpen(false);
        fetchSearchResults();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update note.', 'error');
    }
  };

  const tasksCount = results.tasks?.length || 0;
  const notesCount = results.notes?.length || 0;
  const totalCount = tasksCount + notesCount;

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full flex flex-col overflow-hidden font-sans">
      
      {/* Header Panel */}
      <div className="shrink-0">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Search & Tags Hub</h1>
        <p className="text-gray-400 text-sm mt-1">
          Perform multi-attribute queries, filter tasks dynamically, and search notes.
        </p>
      </div>

      {/* Search Input Box & Recent Searches */}
      <div className="space-y-4 shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search across title, description, category, tags, and note contents..."
          />
          <button
            type="submit"
            className="btn-primary px-8 rounded-2xl shadow-lg shadow-brand-500/10 font-bold shrink-0 focus:outline-none"
          >
            Search
          </button>
        </form>

        <RecentSearches
          queries={recentSearches}
          onSelectQuery={handleSelectRecentQuery}
          onRemoveQuery={handleRemoveRecentQuery}
          onClearAll={handleClearRecentQueries}
        />
      </div>

      {/* Filter Panel */}
      <div className="shrink-0">
        <FilterPanel
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          onReset={handleResetFilters}
        />
      </div>

      {/* Results Tab Selector */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-bold transition-all rounded-xl ${
              activeTab === 'all'
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Results ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-bold transition-all rounded-xl ${
              activeTab === 'tasks'
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tasks ({tasksCount})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 font-bold transition-all rounded-xl ${
              activeTab === 'notes'
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Notes ({notesCount})
          </button>
        </div>
        <div className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
          Matching Tasks & Notes
        </div>
      </div>

      {/* Results Body */}
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <FiLoader className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : totalCount > 0 ? (
          <div className="space-y-8 animate-fade-in pb-10">
            {/* TASKS VIEW */}
            {(activeTab === 'all' || activeTab === 'tasks') && tasksCount > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-400 px-1">
                  Tasks ({tasksCount})
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {results.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`glass-card p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-white/15 bg-white/[0.01] ${
                        task.status === 'Completed' ? 'border-emerald-500/10 opacity-70' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <button
                          onClick={() => task.status !== 'Completed' && handleCompleteTask(task.id)}
                          disabled={task.status === 'Completed'}
                          className={`shrink-0 mt-1 focus:outline-none transition-transform hover:scale-105 duration-200 ${
                            task.status === 'Completed' ? 'text-emerald-500' : 'text-gray-500 hover:text-brand-400'
                          }`}
                        >
                          {task.status === 'Completed' ? (
                            <FiCheckSquare className="h-5.5 w-5.5" />
                          ) : (
                            <FiSquare className="h-5.5 w-5.5" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-bold text-base tracking-wide truncate ${
                              task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-200'
                            }`}>
                              <SearchText text={task.title} search={searchQuery} />
                            </h3>
                            
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border leading-none ${
                              task.priority === 'High'
                                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                                : task.priority === 'Low'
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            }`}>
                              {task.priority}
                            </span>

                            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 leading-none">
                              <SearchText text={task.category || 'Other'} search={searchQuery} />
                            </span>
                          </div>

                          {task.description && (
                            <p className={`text-xs text-gray-400 mt-1.5 leading-relaxed ${
                              task.status === 'Completed' ? 'line-through text-gray-600' : ''
                            }`}>
                              <SearchText text={task.description} search={searchQuery} />
                            </p>
                          )}

                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
                            {task.due_date && (
                              <span className="flex items-center gap-1.5 font-medium">
                                <FiCalendar className="h-3.5 w-3.5 text-brand-400" />
                                Due: {task.due_date}
                              </span>
                            )}
                            {task.due_time && (
                              <span className="flex items-center gap-1.5 font-medium">
                                <FiClock className="h-3.5 w-3.5 text-brand-400" />
                                Time: {task.due_time}
                              </span>
                            )}
                            
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <FiTag className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                                <div className="flex flex-wrap gap-1">
                                  {task.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] bg-purple-950/25 border border-purple-500/15 text-purple-300 rounded px-1.5 py-0.2 ml-0.5">
                                      #<SearchText text={tag} search={searchQuery} />
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Task Action Buttons */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0 border-t border-white/5 md:border-none pt-3 md:pt-0">
                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all focus:outline-none"
                          title="Edit Task"
                        >
                          <FiEdit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl border border-white/5 hover:border-rose-500/20 transition-all focus:outline-none"
                          title="Delete Task"
                        >
                          <FiTrash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTES VIEW */}
            {(activeTab === 'all' || activeTab === 'notes') && notesCount > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 px-1">
                  Notes ({notesCount})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.notes.map((note) => (
                    <div
                      key={note.id}
                      className="glass-card p-5 border border-white/10 flex flex-col justify-between gap-4 transition-all hover:border-white/15 bg-white/[0.01]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-gray-200 text-base leading-snug">
                            <SearchText text={note.title} search={searchQuery} />
                          </h4>
                          <span className="shrink-0 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <FiFileText className="h-4 w-4" />
                          </span>
                        </div>
                        {note.content && (
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                            <SearchText text={note.content} search={searchQuery} />
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5 text-[11px] text-gray-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <FiClock className="h-3.5 w-3.5 text-gray-600" />
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditNote(note)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all focus:outline-none"
                            title="Edit Note"
                          >
                            <FiEdit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-white/5 hover:border-rose-500/20 transition-all focus:outline-none"
                            title="Delete Note"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl h-64">
            <FiGrid className="h-12 w-12 text-gray-600 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-1">No search matches found</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Verify your spelling or adjust active category/priority/status filters to broaden the search.
            </p>
          </div>
        )}
      </div>

      {/* Task Modal (Edit only) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Note Modal (Edit only) */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
      />

    </div>
  );
};

export default Search;
