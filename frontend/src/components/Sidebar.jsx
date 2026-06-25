import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiLayout, 
  FiCheckSquare, 
  FiFileText, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiMic, 
  FiCpu, 
  FiSettings 
} from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: FiLayout },
    { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
    { to: '/notes', label: 'Notes', icon: FiFileText },
    { to: '/capture', label: 'AI Capture', icon: FiMic },
    { to: '/search', label: 'Search', icon: FiSearch },
    { to: '/summary', label: 'Summary', icon: FiCpu },
    { to: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-dark-sec border-b border-dark-border sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-500/20">
            P
          </div>
          <span className="font-extrabold tracking-tight text-white text-lg">Productivity AI</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0A0A] border-r border-dark-border transform transition-transform duration-200 ease-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col pt-6 md:pt-8 md:sticky md:h-screen shrink-0 font-sans`}>
        {/* Brand Header (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-6 mb-10">
          <div className="h-10 w-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/20">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white leading-none">Productivity AI</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">Gemini AI Hub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/5 text-white border border-dark-border'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-white transition-colors" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Footer version info */}
        <div className="p-6 border-t border-dark-border text-[9px] text-gray-600 font-extrabold tracking-widest uppercase">
          Commit #9 ✦ Hackathon v0.2.0
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
