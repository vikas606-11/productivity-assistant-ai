import React from 'react';
import { FiRefreshCw, FiCpu, FiCalendar } from 'react-icons/fi';

const SummaryCard = ({ summary, loading, onRefresh }) => {
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-brand-950/20 to-purple-950/20 w-full flex-1">
      {/* Background glow decorator */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <FiCpu className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide text-base">Gemini Productivity Report</h3>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 font-medium">
              <FiCalendar className="h-3.5 w-3.5" />
              {todayStr}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none"
          title="Regenerate AI report summary"
        >
          <FiRefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Summary Text Content */}
      <div className="relative z-10">
        {loading ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-4 bg-white/5 rounded-full w-full" />
            <div className="h-4 bg-white/5 rounded-full w-[95%]" />
            <div className="h-4 bg-white/5 rounded-full w-[70%]" />
          </div>
        ) : summary ? (
          <p className="text-sm md:text-base text-gray-200 leading-relaxed font-sans font-medium whitespace-pre-line">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic py-2">
            No productivity details found. Create notes or tasks to get started, then click refresh.
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
