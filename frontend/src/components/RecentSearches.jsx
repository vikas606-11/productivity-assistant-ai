import React from 'react';
import { FiClock, FiTrash2, FiX } from 'react-icons/fi';

const RecentSearches = ({ queries = [], onSelectQuery, onRemoveQuery, onClearAll }) => {
  if (queries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 w-full text-xs">
      <div className="flex items-center justify-between text-gray-500">
        <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[10px]">
          <FiClock className="h-3.5 w-3.5 text-gray-400" />
          Recent Searches
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="hover:text-rose-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 focus:outline-none transition-colors"
        >
          <FiTrash2 className="h-3 w-3" />
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {queries.map((query, index) => (
          <span
            key={index}
            onClick={() => onSelectQuery(query)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 hover:text-white rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 group font-medium"
          >
            <span>{query}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveQuery(query);
              }}
              className="p-0.5 hover:bg-white/10 rounded text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
              title="Remove query"
            >
              <FiX className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
