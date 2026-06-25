import React, { useState, useEffect } from 'react';
import { taskService, noteService, aiService } from '../services/api';
import { useToast } from '../components/Toast';
import { 
  FiActivity, 
  FiClock, 
  FiCheckCircle, 
  FiFileText, 
  FiCpu, 
  FiCalendar, 
  FiList, 
  FiArrowRight, 
  FiLoader 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NL Capture States
  const [captureText, setCaptureText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [capturedResult, setCapturedResult] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, notesRes] = await Promise.all([
        taskService.getAll(),
        noteService.getAll()
      ]);
      
      if (tasksRes.success) setTasks(tasksRes.data);
      if (notesRes.success) setNotes(notesRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard metrics data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!captureText.trim()) return;

    try {
      setCapturing(true);
      setCapturedResult(null);
      
      const res = await aiService.capture(captureText);
      
      if (res.success) {
        const { tasks: newTasks, notes: newNotes } = res.data;
        const totalItems = (newTasks?.length || 0) + (newNotes?.length || 0);
        
        showToast(`Successfully captured and saved ${totalItems} items!`, 'success');
        setCapturedResult(res.data);
        setCaptureText('');
        
        // Refresh data
        fetchData();
      } else {
        showToast(res.message || 'AI capture parsing failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Gemini processing failed. Check your API key config.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  // Helper: check if task is due today
  const isDueToday = (task) => {
    if (!task.due_date) return false;
    const cleanDate = task.due_date.trim().toLowerCase();
    if (cleanDate === 'today') return true;
    
    // Resolve YYYY-MM-DD
    const todayStr = new Date().toLocaleDateString('en-CA'); // Gets local YYYY-MM-DD
    return cleanDate === todayStr;
  };

  // Metrics Calculations
  const totalTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const totalNotesCount = notes.length;

  const todayTasks = tasks.filter(t => isDueToday(t) && t.status === 'Pending');
  const recentTasks = [...tasks]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none mb-2">
          Hello, Productivity Partner ✦
        </h1>
        <p className="text-gray-400 text-sm">
          Parse text using Gemini AI, track your tasks, and jot down important ideas.
        </p>
      </div>

      {/* Natural Language Capture section */}
      <section className="glass-card p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02]">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <FiCpu className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">Gemini Natural Language Capture</h2>
        </div>

        <form onSubmit={handleCapture} className="space-y-4">
          <textarea
            placeholder="Type anything... e.g., 'Prepare AWS presentation tomorrow at 5 PM, buy groceries under Shopping, and note meeting minutes with Sarah: we discussed server migrations.'"
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
            disabled={capturing}
            rows="3"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={capturing || !captureText.trim()}
              className="btn-primary w-full sm:w-auto px-8 py-3 bg-brand-500 hover:bg-brand-600 font-semibold flex items-center justify-center gap-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-brand-500/20"
            >
              {capturing ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  Gemini is thinking...
                </>
              ) : (
                <>
                  <FiCpu className="h-4 w-4" />
                  Capture Items
                </>
              )}
            </button>
          </div>
        </form>

        {/* Captured Items Results Preview */}
        {capturedResult && (
          <div className="mt-6 border-t border-white/5 pt-6 space-y-4 animate-bounce-in">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">
              ✦ Captured Productivity Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Captured Tasks */}
              {capturedResult.tasks && capturedResult.tasks.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <FiCheckCircle className="h-4 w-4" />
                    Tasks ({capturedResult.tasks.length})
                  </div>
                  <ul className="space-y-2">
                    {capturedResult.tasks.map((t, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-200">{t.title}</span>
                          {t.category && <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 rounded-md px-1.5 py-0.5 ml-2 font-medium">{t.category}</span>}
                          {t.due_date && <span className="text-[10px] text-brand-400 ml-2 font-semibold">Due: {t.due_date}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Captured Notes */}
              {capturedResult.notes && capturedResult.notes.length > 0 && (
                <div className="bg-purple-950/20 border border-purple-500/25 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                    <FiFileText className="h-4 w-4" />
                    Notes ({capturedResult.notes.length})
                  </div>
                  <ul className="space-y-2">
                    {capturedResult.notes.map((n, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-200">{n.title}</span>
                          {n.content && <p className="text-xs text-gray-400 mt-0.5 truncate">{n.content}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Metrics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: totalTasksCount, color: 'text-brand-400 border-brand-500/10', icon: FiActivity },
          { label: 'Pending Tasks', value: pendingTasksCount, color: 'text-amber-400 border-amber-500/10', icon: FiClock },
          { label: 'Completed Tasks', value: completedTasksCount, color: 'text-emerald-400 border-emerald-500/10', icon: FiCheckCircle },
          { label: 'Notes Saved', value: totalNotesCount, color: 'text-purple-400 border-purple-500/10', icon: FiFileText },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`glass-card p-5 border shadow-xl flex items-center justify-between group hover:border-white/20 transition-all duration-200 ${stat.color}`}>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-white leading-none">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors duration-250 border border-white/5">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Lists Layout: Today's Tasks & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Pending Tasks list */}
        <section className="glass-card p-6 border border-white/10 shadow-xl bg-white/[0.01] flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <FiCalendar className="h-5 w-5 text-brand-400" />
              <h3 className="font-bold text-white text-base">Today's Tasks</h3>
            </div>
            <Link to="/tasks" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
              View All <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <FiLoader className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : todayTasks.length > 0 ? (
            <ul className="divide-y divide-white/5 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {todayTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="font-semibold text-sm text-gray-200 truncate">{t.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded px-1.5 py-0.5">
                        {t.category || 'Other'}
                      </span>
                      {t.due_time && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          {t.due_time}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    t.priority === 'High' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : t.priority === 'Low'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl">
              <FiCheckCircle className="h-10 w-10 text-emerald-500/40 mb-3" />
              <p className="text-sm font-semibold text-gray-300">All caught up for today!</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px]">No pending tasks scheduled for today.</p>
            </div>
          )}
        </section>

        {/* Recent Tasks list */}
        <section className="glass-card p-6 border border-white/10 shadow-xl bg-white/[0.01] flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <FiList className="h-5 w-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Recent Tasks</h3>
            </div>
            <Link to="/tasks" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              View All <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-10">
              <FiLoader className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : recentTasks.length > 0 ? (
            <ul className="divide-y divide-white/5 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {recentTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className={`font-semibold text-sm truncate ${
                      t.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-200'
                    }`}>{t.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold bg-white/5 border border-white/10 text-gray-400 rounded px-1.5 py-0.5">
                        {t.category || 'Other'}
                      </span>
                      {t.due_date && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          Due: {t.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    t.status === 'Completed' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}>
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl">
              <FiList className="h-10 w-10 text-gray-600 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-300">No tasks created yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[240px]">Create your first task or use AI capture to parse items.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
