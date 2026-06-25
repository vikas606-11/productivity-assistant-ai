import React, { useState, useEffect } from 'react';
import { taskService, noteService, aiService } from '../services/api';
import { useToast } from '../components/Toast';
import { FiCpu, FiLoader } from 'react-icons/fi';
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
        
        showToast(`Successfully captured and saved ${totalItems} items!`, 'success');
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
      showToast(err.response?.data?.message || 'Gemini processing failed. Check your API key config.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  // Actions for InsightsPanel
  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskService.complete(taskId);
      if (res.success) {
        showToast('Task marked as completed!', 'success');
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          Hello, Productivity Partner ✦
        </h1>
        <p className="text-gray-400 text-sm">
          Optimize your task execution workflows and capture notes powered by Gemini AI.
        </p>
      </div>

      {/* Statistics Cards */}
      <section>
        <StatisticsCards
          statistics={summary?.statistics}
          loading={loadingSummary}
        />
      </section>

      {/* AI Summary and Actionable Insights Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SummaryCard
          summary={summary?.summary}
          loading={loadingSummary}
          onRefresh={() => fetchSummary(true)}
        />
        <SuggestionCard
          suggestions={summary?.suggestions}
          loading={loadingSummary}
        />
      </section>

      {/* Capture Input Form and Insights panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Priority Action Insights Hub */}
        <section>
          <InsightsPanel
            insights={summary?.insights}
            loading={loadingSummary}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* Natural Language Capture section */}
        <section className="glass-card p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02] min-h-[350px] flex flex-col justify-between">
          {/* Glow decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <FiCpu className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Capture Engine</h2>
            </div>

            <form onSubmit={handleCapture} className="space-y-4">
              <VoiceInput
                captureText={captureText}
                setCaptureText={setCaptureText}
                disabled={capturing}
                placeholder="Type or use voice: 'Finish slide deck by 5 PM today and mark under Work, also note down hackathon idea to use Flask and SQLite.'"
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
                      Processing NL Capture...
                    </>
                  ) : (
                    <>
                      <FiCpu className="h-4 w-4" />
                      Parse Capture
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Captured Items Results Preview */}
          {capturedResult && (
            <div className="mt-6 border-t border-white/5 pt-6 space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                ✦ Captured Productivity Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Captured Tasks */}
                {capturedResult.tasks && capturedResult.tasks.length > 0 && (
                  <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-4 space-y-2.5">
                    <div className="text-emerald-300 font-bold text-xs uppercase tracking-wider">
                      Tasks ({capturedResult.tasks.length})
                    </div>
                    <ul className="space-y-2 text-xs">
                      {capturedResult.tasks.map((t, idx) => (
                        <li key={idx} className="text-gray-300">
                          <span className="font-semibold text-gray-200">{t.title}</span>
                          {t.category && <span className="text-[9px] bg-white/5 border border-white/10 text-gray-400 rounded px-1 ml-1.5">{t.category}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Captured Notes */}
                {capturedResult.notes && capturedResult.notes.length > 0 && (
                  <div className="bg-purple-950/20 border border-purple-500/25 rounded-2xl p-4 space-y-2.5">
                    <div className="text-purple-300 font-bold text-xs uppercase tracking-wider">
                      Notes ({capturedResult.notes.length})
                    </div>
                    <ul className="space-y-2 text-xs">
                      {capturedResult.notes.map((n, idx) => (
                        <li key={idx} className="text-gray-300">
                          <span className="font-semibold text-gray-200">{n.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

      </div>

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
