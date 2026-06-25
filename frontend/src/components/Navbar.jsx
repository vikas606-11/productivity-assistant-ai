import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMic, FiMoon, FiCpu } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Avatar placeholder with Vikas initials
  const initials = "V";

  return (
    <nav className="bg-dark-bg border-b border-dark-border sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between shrink-0 font-sans">
      
      {/* Left: Project Logo (Mobile only/Desktop toggle) */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => navigate('/')}
          className="md:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-500/20">
            P
          </div>
          <span className="font-extrabold tracking-tight text-white text-base">Productivity AI</span>
        </div>
        
        {/* Page Context (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 border border-dark-border px-2 py-0.5 rounded-md leading-none">
            Gemini Core v1.2
          </span>
        </div>
      </div>

      {/* Center: Search command palette look-alike */}
      {location.pathname !== '/search' && (
        <div 
          onClick={() => navigate('/search')}
          className="relative w-full max-w-sm mx-4 cursor-pointer hidden sm:block"
        >
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
          <div className="w-full bg-dark-card border border-dark-border hover:border-dark-border/20 text-gray-500 text-xs rounded-xl pl-10 pr-4 py-2.5 transition-colors flex items-center justify-between select-none">
            <span>Search tasks, notes, tags...</span>
            <kbd className="bg-dark-bg border border-dark-border px-1.5 py-0.5 rounded-md text-[9px] text-gray-600 font-mono font-bold leading-none">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-4 ml-auto sm:ml-0">
        {/* Voice Trigger navigation */}
        <button
          type="button"
          onClick={() => navigate('/capture')}
          className={`p-2 rounded-xl border border-dark-border hover:bg-white/5 text-gray-400 hover:text-white transition-all focus:outline-none ${
            location.pathname === '/capture' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-dark-card'
          }`}
          title="Voice Capture workspace"
        >
          <FiMic className="h-4 w-4" />
        </button>

        {/* Dark Mode badge */}
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/5 border border-brand-500/20 text-brand-400 rounded-lg text-[9px] font-extrabold uppercase tracking-widest leading-none select-none">
          <FiMoon className="h-3 w-3 shrink-0" />
          Dark Mode
        </span>

        {/* User avatar */}
        <div 
          onClick={() => navigate('/settings')}
          className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white text-xs font-black cursor-pointer border border-brand-500/30 hover:scale-105 active:scale-95 transition-all select-none shadow-md shadow-brand-500/15"
          title="Developer configurations settings"
        >
          {initials}
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
