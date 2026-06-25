import React from 'react';
import { FiClock, FiCheckCircle, FiInbox, FiCalendar, FiActivity } from 'react-icons/fi';

const StatisticsCards = ({ statistics = {}, loading }) => {
  const {
    pending_count = 0,
    completed_count = 0,
    due_today_count = 0,
    completion_rate = 0.0
  } = statistics;

  const totalTasks = pending_count + completed_count;

  const statsList = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: FiInbox,
      color: 'border-dark-border hover:border-white/5 bg-dark-card/30',
      iconBg: 'bg-white/5 text-gray-300 border-dark-border'
    },
    {
      label: 'Completed Tasks',
      value: completed_count,
      icon: FiCheckCircle,
      color: 'border-dark-border hover:border-white/5 bg-dark-card/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      label: 'Pending Tasks',
      value: pending_count,
      icon: FiClock,
      color: 'border-dark-border hover:border-white/5 bg-dark-card/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      label: 'Today\'s Tasks',
      value: due_today_count,
      icon: FiCalendar,
      color: 'border-dark-border hover:border-white/5 bg-dark-card/30',
      iconBg: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
    },
    {
      label: 'AI Productivity Score',
      value: `${completion_rate}%`,
      icon: FiActivity,
      color: 'border-dark-border hover:border-white/5 bg-dark-card/30',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      progressBar: completion_rate
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full font-sans">
      {statsList.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-card p-5 border shadow-xl flex flex-col justify-between gap-3 group transition-all duration-200 ${
              idx === 4 ? 'col-span-2 md:col-span-1' : ''
            } ${stat.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {stat.label}
                </p>
                <p className="text-2xl md:text-3xl font-black text-white leading-none">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 ${stat.iconBg}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Render a custom progress bar if it's the AI Productivity Score card */}
            {stat.progressBar !== undefined && !loading && (
              <div className="space-y-1 mt-1">
                <div className="w-full bg-[#111111] rounded-full h-1 overflow-hidden border border-dark-border">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(stat.progressBar, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
