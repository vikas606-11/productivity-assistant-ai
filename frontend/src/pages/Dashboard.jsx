import React, { useState, useEffect } from 'react';
import { taskService, noteService, aiService } from '../services/api';
import { useToast } from '../components/Toast';
import { FiCpu, FiLoader, FiCheckCircle } from 'react-icons/fi';
import VoiceInput from '../components/VoiceInput';
import TaskModal from '../components/TaskModal';
import {
  SummaryCard,
  SuggestionCard,
  StatisticsCards,
  InsightsPanel
} from '../components';

const Dashboard = () => {
  const { showToast } = useToast();
  
  // Data States
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NL Capture States
  const [captureText, setCaptureText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [capturedResult, setCapturedResult] = useState(null);

  // AI Summary States
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Edit Task States
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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

  const fetchSummary = async (forceRefresh = false) => {
    try {
      setLoadingSummary(true);
      const res = await taskService.getSummary(forceRefresh);
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load AI productivity summary.', 'error');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSummary();
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
        
        showToast(`AI Processing Complete. Captured ${totalItems} items.`, 'success');
        setCapturedResult(res.data);
        setCaptureText('');
        
        // Refresh data & AI summary
        fetchData();
        fetchSummary();
      } else {
        showToast(res.message || 'AI capture parsing failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Gemini processing failed. Check settings.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  // Actions for InsightsPanel
  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskService.complete(taskId);
      if (res.success) {
        showToast('Task Created & Completed successfully!', 'success');
        fetchData();
        fetchSummary();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to complete task.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await taskService.delete(taskId);
      if (res.success) {
        showToast('Task deleted successfully.', 'success');
        fetchData();
        fetchSummary();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete task.', 'error');
    }
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      const res = await taskService.update(editingTask.id, taskData);
      if (res.success) {
        showToast('Task updated successfully!', 'success');
        setIsTaskModalOpen(false);
        fetchData();
        fetchSummary();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update task.', 'error');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto font-sans">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
          Productivity Workspace
        </h1>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
          AI Copilot Command Center
        </p>
      </div>

      {/* 1. Natural Language Capture Card (AT THE TOP) */}
      <section className="glass-card p-6 md:p-8 relative overflow-hidden border border-dark-border shadow-2xl bg-[#181818] w-full">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-dark-border/40">
          <div className="h-8.5 w-8.5 rounded-lg bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-500 shrink-0">
            <FiCpu className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">AI Command Interface</h2>
            <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">Natural Language Parsing</span>
          </div>
        </div>

        <form onSubmit={handleCapture} className="space-y-4">
          <VoiceInput
            captureText={captureText}
            setCaptureText={setCaptureText}
            disabled={capturing}
            placeholder="What do you need to accomplish today?"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={capturing || !captureText.trim()}
              className="btn-primary w-full sm:w-auto px-8 py-3 bg-brand-500 hover:bg-brand-600 font-bold flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-brand-500/20 text-xs uppercase tracking-wider focus:outline-none"
            >
              {capturing ? (
                <>
                  <FiLoader className="h-4.5 w-4.5 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  <FiCpu className="h-4.5 w-4.5" />
                  Capture
                </>
              )}
            </button>
          </div>
        </form>

        {/* Captured Items Preview */}
        {capturedResult && (
          <div className="mt-6 border-t border-dark-border pt-6 space-y-4 animate-fade-in">
            <h3 className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
              ✦ Captured Productivity Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tasks */}
              {capturedResult.tasks && capturedResult.tasks.length > 0 && (
                <div className="bg-emerald-950/[0.05] border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    Tasks ({capturedResult.tasks.length})
                  </div>
                  <ul className="space-y-2 text-xs">
                    {capturedResult.tasks.map((t, idx) => (
                      <li key={idx} className="text-gray-300">
                        • <span className="font-bold text-gray-200">{t.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Notes */}
              {capturedResult.notes && capturedResult.notes.length > 0 && (
                <div className="bg-purple-950/[0.05] border border-purple-500/20 rounded-xl p-4 space-y-2">
                  <div className="text-purple-400 font-bold text-xs uppercase tracking-wider">
                    Notes ({capturedResult.notes.length})
                  </div>
                  <ul className="space-y-2 text-xs">
                    {capturedResult.notes.map((n, idx) => (
                      <li key={idx} className="text-gray-300">
                        • <span className="font-bold text-gray-200">{n.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Premium AI Summary Card & Suggestions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SummaryCard
          summary={summary?.summary}
          loading={loadingSummary}
          onRefresh={() => fetchSummary(true)}
          stats={{
            pending: summary?.statistics?.pending_count,
            overdue: summary?.statistics?.overdue_count,
            highPriority: summary?.insights?.high_priority?.length
          }}
        />
        <SuggestionCard
          suggestions={summary?.suggestions}
          loading={loadingSummary}
        />
      </section>

      {/* 3. Statistics Grid */}
      <section>
        <StatisticsCards
          statistics={summary?.statistics}
          loading={loadingSummary}
        />
      </section>

      {/* 4. Priority Insights Hub */}
      <section>
        <InsightsPanel
          insights={summary?.insights}
          loading={loadingSummary}
          onCompleteTask={handleCompleteTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>

      {/* Task Modal for Editing */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

    </div>
  );
};

export default Dashboard;
