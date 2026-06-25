import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiLayout, FiCheckSquare, FiFileText, FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: FiLayout },
    { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
    { to: '/notes', label: 'Notes', icon: FiFileText },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-white/5 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">
            P
          </div>
          <span className="font-bold tracking-tight text-white text-lg">Productivity AI</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white focus:outline-none p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900/95 md:bg-gray-950/60 md:backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col pt-6 md:pt-8 md:sticky md:h-screen shrink-0`}>
        {/* Brand Header (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-6 mb-10">
          <div className="h-10 w-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/25">
            P
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white leading-none">Productivity AI</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Gemini-Powered</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Footer version info */}
        <div className="p-6 border-t border-white/5 text-[11px] text-gray-600 font-medium">
          Commit #5 ✦ Hackathon v0.1.0
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
