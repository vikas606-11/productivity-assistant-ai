import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search title, description, tags, notes...' }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-500">
        <FiSearch className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-white placeholder-gray-500 text-sm rounded-2xl pl-12 pr-12 py-3.5 transition-all outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
