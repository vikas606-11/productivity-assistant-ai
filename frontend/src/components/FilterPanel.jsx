import React from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const FilterPanel = ({
  category,
  setCategory,
  status,
  setStatus,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  onReset
}) => {
  const categories = ['All', 'Work', 'Study', 'Shopping', 'Personal', 'Health', 'Finance', 'Other'];
  const statuses = ['All', 'Pending', 'Completed'];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  return (
    <div className="glass-card p-5 border border-white/10 bg-white/[0.02] space-y-5 rounded-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <FiFilter className="h-4.5 w-4.5 text-brand-400" />
          Filter Parameters
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none"
        >
          <FiRefreshCw className="h-3 w-3" />
          Reset Filters
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 hover:border-white/15 focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-950">{cat}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 hover:border-white/15 focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat} className="bg-gray-950">{stat}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 hover:border-white/15 focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
          >
            {priorities.map((prio) => (
              <option key={prio} value={prio} className="bg-gray-950">{prio}</option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 hover:border-white/15 focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
