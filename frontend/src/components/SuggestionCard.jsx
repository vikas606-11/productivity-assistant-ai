import React from 'react';
import { FiTrendingUp, FiCpu } from 'react-icons/fi';

const SuggestionCard = ({ suggestions = [], loading }) => {
  return (
    <div className="glass-card p-6 md:p-8 border border-white/10 shadow-2xl w-full flex-1">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
        <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <FiCpu className="h-5.5 w-5.5" />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-wide text-base">Actionable Insights</h3>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Gemini Suggestions</span>
        </div>
      </div>

      {/* Recommendations List */}
      <div>
        {loading ? (
          <div className="space-y-4 py-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-4.5 w-4.5 bg-white/5 rounded-full shrink-0" />
                <div className="h-4 bg-white/5 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed font-medium">
                <span className="mt-1 flex h-4.5 w-4.5 items-center justify-center rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
                  <FiTrendingUp className="h-3 w-3" />
                </span>
                <span className="flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic py-2">
            No productivity recommendations available at this time. Click refresh report to generate.
          </p>
        )}
      </div>
    </div>
  );
};

export default SuggestionCard;
