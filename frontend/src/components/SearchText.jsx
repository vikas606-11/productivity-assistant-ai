import React from 'react';

const SearchText = ({ text, search }) => {
  if (!search || !text) {
    return <span>{text}</span>;
  }

  // Escape special regex characters in the search term
  const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-brand-500/40 text-brand-200 rounded px-0.5 font-bold border-b border-brand-400/40">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default SearchText;
