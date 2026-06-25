import React from 'react';
import { FiRefreshCw, FiCpu, FiCalendar } from 'react-icons/fi';

const SummaryCard = ({ summary, loading, onRefresh, stats = {} }) => {
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const {
    pending = 0,
    overdue = 0,
    highPriority = 0
  } = stats;

  return (
    <div className="glass-card p-6 md:p-8 border border-dark-border shadow-2xl relative overflow-hidden bg-[#181818] w-full flex-1 font-sans">
      
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-dark-border relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-500">
            <FiCpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide text-sm">Gemini AI Executive Summary</h3>
            <span className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider">
              <FiCalendar className="h-3 w-3" />
              {todayStr}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg border border-dark-border bg-dark-bg text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none"
          title="Regenerate AI report summary"
        >
          <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-brand-500' : ''}`} />
        </button>
      </div>

      {/* Greeting and Counts Summary */}
      <div className="mb-4 space-y-1 relative z-10">
        <h2 className="text-xl md:text-2xl font-black text-white leading-none">
          Good Morning, Vikas
        </h2>
        {!loading && (
          <p className="text-xs font-semibold text-gray-400">
            You have <span className="text-white font-bold">{pending} pending</span> tasks today. 
            {" "}<span className="text-brand-500 font-bold">{highPriority}</span> are high priority. 
            {" "}<span className="text-rose-500 font-bold">{overdue}</span> are overdue.
          </p>
        )}
      </div>

      {/* Summary Text Content */}
      <div className="relative z-10 text-xs md:text-sm text-gray-400 leading-relaxed whitespace-pre-line font-medium border-t border-dark-border/40 pt-4 mt-3">
        {loading ? (
          <div className="space-y-2 py-1 animate-pulse">
            <div className="h-3.5 bg-white/5 rounded-full w-full" />
            <div className="h-3.5 bg-white/5 rounded-full w-[95%]" />
            <div className="h-3.5 bg-white/5 rounded-full w-[60%]" />
          </div>
        ) : summary ? (
          <p className="text-gray-300">
            {summary}
          </p>
        ) : (
          <p className="text-gray-600 italic">
            No productivity details found. Create notes or tasks to get started, then click refresh.
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
