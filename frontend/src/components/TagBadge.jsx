import React from 'react';
import { FiTag, FiX } from 'react-icons/fi';

const TagBadge = ({ tag, onRemove, onClick, active = false }) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${
        active
          ? 'bg-brand-500 border-brand-400 text-white shadow-md shadow-brand-500/15'
          : 'bg-purple-950/20 border-purple-500/20 text-purple-300 hover:bg-purple-950/30 hover:border-purple-500/35'
      }`}
    >
      <FiTag className="h-3 w-3 shrink-0" />
      <span>{tag}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className="ml-1 p-0.5 hover:bg-white/10 rounded-full text-purple-300 hover:text-white transition-colors focus:outline-none"
        >
          <FiX className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;
