import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-x-hidden">
          
          {/* Ambient background glows for premium visual design */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[850px] h-[850px] rounded-full bg-brand-500/5 blur-[150px]" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px]" />

          {/* Navigation Sidebar */}
          <Sidebar />

          {/* Main App Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </main>
          
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
