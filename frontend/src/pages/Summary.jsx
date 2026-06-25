import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { useToast } from '../components/Toast';
import TaskModal from '../components/TaskModal';
import {
  SummaryCard,
  SuggestionCard,
  StatisticsCards,
  InsightsPanel
} from '../components';

const Summary = () => {
  const { showToast } = useToast();
  
  // Data States
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Task States
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchSummary = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const res = await taskService.getSummary(forceRefresh);
      if (res.success) {
        setSummary(res.data);
        if (forceRefresh) {
          showToast("AI Processing Complete. Refreshed summary.", "success");
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load AI summary.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Action Handlers
  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskService.complete(taskId);
      if (res.success) {
        showToast('Task marked as completed!', 'success');
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
        fetchSummary();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update task.', 'error');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto font-sans">
      
      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Productivity Hub</h1>
        <p className="text-gray-400 text-sm mt-1">
          Deep-dive diagnostics, summaries, and action tips parsed by Gemini.
        </p>
      </div>

      {/* Statistics Cards */}
      <section>
        <StatisticsCards
          statistics={summary?.statistics}
          loading={loading}
        />
      </section>

      {/* AI Summary Card & Suggestion Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SummaryCard
          summary={summary?.summary}
          loading={loading}
          onRefresh={() => fetchSummary(true)}
          stats={{
            pending: summary?.statistics?.pending_count,
            overdue: summary?.statistics?.overdue_count,
            highPriority: summary?.insights?.high_priority?.length
          }}
        />
        <SuggestionCard
          suggestions={summary?.suggestions}
          loading={loading}
        />
      </section>

      {/* Priority Lists Hub */}
      <section>
        <InsightsPanel
          insights={summary?.insights}
          loading={loading}
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

export default Summary;
