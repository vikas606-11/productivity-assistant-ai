import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { taskService } from '../services/api';
import TagBadge from './TagBadge';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const categories = ['Work', 'Study', 'Shopping', 'Personal', 'Health', 'Finance', 'Other'];
  const priorities = ['High', 'Medium', 'Low'];

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCategory(task.category || 'Other');
      setPriority(task.priority || 'Medium');
      setDueDate(task.due_date || '');
      setDueTime(task.due_time || '');
      
      // Parse tags
      const initialTags = task.tags
        ? (Array.isArray(task.tags)
            ? task.tags
            : task.tags.split(',').map((t) => t.trim()))
        : [];
      setTagList(initialTags.filter(Boolean));
    } else {
      setTitle('');
      setDescription('');
      setCategory('Other');
      setPriority('Medium');
      setDueDate('');
      setDueTime('');
      setTagList([]);
    }
    setTagInput('');
    setSuggestedTags([]);
  }, [task, isOpen]);

  // Fetch tag suggestions from Gemini if editing
  useEffect(() => {
    if (isOpen && task && task.title) {
      const fetchSuggestions = async () => {
        try {
          setLoadingSuggestions(true);
          const res = await taskService.suggestTags(task.title, task.description || '');
          if (res.success) {
            setSuggestedTags(res.data);
          }
        } catch (e) {
          console.error('[TaskModal] Failed to load tag suggestions:', e);
        } finally {
          setLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (newTag) => {
    const cleaned = newTag.trim().toLowerCase().replace(/,/g, '');
    if (cleaned && !tagList.includes(cleaned)) {
      setTagList([...tagList, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList(tagList.filter((t) => t !== tagToRemove));
  };

  const handleAddSuggestedTag = (tag) => {
    if (!tagList.includes(tag)) {
      setTagList([...tagList, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || null,
      category,
      priority,
      due_date: dueDate || null,
      due_time: dueTime || null,
      tags: tagList,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg overflow-hidden shadow-2xl border border-white/10 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Call Rahul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Provide context or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              >
                {priorities.map(prio => (
                  <option key={prio} value={prio} className="bg-gray-900">{prio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-white/5 border border-white/10 rounded-xl min-h-[46px] items-center">
              {tagList.length > 0 ? (
                tagList.map((tag) => (
                  <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
                ))
              ) : (
                <span className="text-xs text-gray-500 select-none">No tags added yet</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type tag and press Add or Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all focus:outline-none"
              >
                Add
              </button>
            </div>

            {/* Suggested Tags (Edit Mode Only) */}
            {task && (
              <div className="mt-3 space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  AI Suggested Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {loadingSuggestions ? (
                    <span className="text-[10px] text-gray-500 italic animate-pulse">Generating suggestions...</span>
                  ) : suggestedTags.length > 0 ? (
                    suggestedTags
                      .filter((tag) => !tagList.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddSuggestedTag(tag)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/10 hover:border-purple-500/25 text-purple-300 text-[10px] font-bold rounded-lg transition-all focus:outline-none"
                        >
                          + #{tag}
                        </button>
                      ))
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">No additional suggestions available.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 bg-white/[0.01] -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2.5"
            >
              <FiCheck className="h-4 w-4" />
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

