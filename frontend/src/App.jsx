import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Search from './pages/Search';
import Capture from './pages/Capture';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-white flex flex-col md:flex-row relative overflow-x-hidden">
          
          {/* Navigation Sidebar */}
          <Sidebar />

          {/* Main App Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10 bg-[#0A0A0A]">
            <Navbar />
            <div className="flex-1 flex flex-col overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/search" element={<Search />} />
                <Route path="/capture" element={<Capture />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
          
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
