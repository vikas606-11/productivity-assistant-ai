import React, { useState } from 'react';
import {
  FiAlertTriangle,
  FiCalendar,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiSquare,
  FiEdit3,
  FiTrash2,
  FiArrowRight,
  FiTag
} from 'react-icons/fi';

const InsightsPanel = ({
  insights = {},
  loading,
  onCompleteTask,
  onEditTask,
  onDeleteTask
}) => {
  const [activeTab, setActiveTab] = useState('overdue');

  const {
    overdue = [],
    due_today = [],
    high_priority = [],
    recently_completed = []
  } = insights;

  const tabs = [
    {
      id: 'overdue',
      label: 'Overdue',
      count: overdue.length,
      icon: FiAlertTriangle,
      color: 'text-rose-400',
      activeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'due_today',
      label: 'Due Today',
      count: due_today.length,
      icon: FiCalendar,
      color: 'text-brand-400',
      activeColor: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
    },
    {
      id: 'high_priority',
      label: 'High Priority',
      count: high_priority.length,
      icon: FiStar,
      color: 'text-amber-400',
      activeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'recently_completed',
      label: 'Completed',
      count: recently_completed.length,
      icon: FiCheckCircle,
      color: 'text-emerald-400',
      activeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'overdue': return overdue;
      case 'due_today': return due_today;
      case 'high_priority': return high_priority;
      case 'recently_completed': return recently_completed;
      default: return [];
    }
  };

  const activeList = getActiveList();

  return (
    <div className="glass-card p-6 border border-white/10 shadow-2xl w-full flex flex-col min-h-[350px]">
      
      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5 shrink-0">
        <div>
          <h3 className="font-bold text-white tracking-wide text-base">Priority Insights Hub</h3>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Critical Deadlines & Actions</span>
        </div>
        
        {/* Tabs Grid */}
        <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
                  activeTab === tab.id
                    ? tab.activeColor
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                <span className="bg-white/5 border border-white/15 px-1.5 py-0.2 rounded-md text-[10px]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {loading ? (
          <div className="space-y-4 py-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl w-full" />
            ))}
          </div>
        ) : activeList.length > 0 ? (
          <div className="space-y-3 pr-1.5">
            {activeList.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-4 p-4 border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Complete Task checkbox button */}
                  {task.status !== 'Completed' ? (
                    <button
                      type="button"
                      onClick={() => onCompleteTask(task.id)}
                      className="mt-0.5 text-gray-500 hover:text-brand-400 transition-colors focus:outline-none shrink-0"
                      title="Complete Task"
                    >
                      <FiSquare className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <span className="mt-0.5 text-emerald-500 shrink-0">
                      <FiCheckCircle className="h-4.5 w-4.5" />
                    </span>
                  )}
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold truncate ${
                        task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-200'
                      }`}>
                        {task.title}
                      </span>
                      
                      {/* Priority Tag */}
                      {task.priority && task.status !== 'Completed' && (
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border leading-none shrink-0 ${
                          task.priority === 'High'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            : task.priority === 'Low'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                      
                      {/* Category Tag */}
                      {task.category && (
                        <span className="text-[8px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 leading-none shrink-0">
                          {task.category}
                        </span>
                      )}
                    </div>

                    {/* Due details */}
                    <div className="flex flex-wrap items-center gap-x-3 mt-1.5 text-xs text-gray-500 font-medium">
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <FiClock className="h-3 w-3 text-brand-400" />
                          Due: {task.due_date} {task.due_time || ''}
                        </span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-purple-400 font-semibold">
                          <FiTag className="h-3 w-3" />
                          #{task.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-colors focus:outline-none"
                    title="Edit Task"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 border border-white/5 hover:border-rose-500/20 transition-colors focus:outline-none"
                    title="Delete Task"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl">
            <FiCheckCircle className="h-8 w-8 text-gray-600 mb-2.5 animate-pulse" />
            <h4 className="text-sm font-bold text-gray-300">Clean slate!</h4>
            <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
              No tasks matched this filter category. Work is fully up to date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
