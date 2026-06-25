import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { useToast } from '../components/Toast';
import TaskModal from '../components/TaskModal';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiCheck, 
  FiSquare, 
  FiCheckSquare, 
  FiCalendar, 
  FiClock, 
  FiTag, 
  FiLoader 
} from 'react-icons/fi';

const Tasks = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Work', 'Study', 'Shopping', 'Personal', 'Health', 'Finance', 'Other'];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getAll();
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const res = await taskService.update(editingTask.id, taskData);
        if (res.success) {
          showToast('Task updated successfully!', 'success');
          setIsModalOpen(false);
          fetchTasks();
        }
      } else {
        // Create task
        const res = await taskService.create(taskData);
        if (res.success) {
          showToast('Task created successfully!', 'success');
          setIsModalOpen(false);
          fetchTasks();
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save task. Ensure title is provided.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await taskService.delete(taskId);
      if (res.success) {
        showToast('Task deleted successfully.', 'success');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete task.', 'error');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const res = await taskService.complete(taskId);
      if (res.success) {
        showToast('Task marked as completed!', 'success');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to complete task.', 'error');
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      statusFilter === 'All' || 
      task.status === statusFilter;

    const matchesCategory = 
      categoryFilter === 'All' || 
      task.category === categoryFilter;

    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full flex flex-col overflow-hidden">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Task Management</h1>
          <p className="text-gray-400 text-sm mt-1">Organize your priorities, track work items, and log statuses.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn-primary px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg shadow-brand-500/20"
        >
          <FiPlus className="h-5 w-5" />
          Add Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4 shrink-0 bg-white/[0.02] border-white/10">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:ml-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Tasks Table/List Container */}
      <div className="flex-1 overflow-y-auto min-h-[250px]">
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <FiLoader className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`glass-card p-5 border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-white/15 bg-white/[0.01] ${
                  task.status === 'Completed' ? 'border-emerald-500/10 opacity-70' : 'border-white/10'
                }`}
              >
                {/* Checkbox and text */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <button
                    onClick={() => task.status !== 'Completed' && handleCompleteTask(task.id)}
                    disabled={task.status === 'Completed'}
                    className={`shrink-0 mt-1 focus:outline-none transition-transform hover:scale-105 duration-200 ${
                      task.status === 'Completed' 
                        ? 'text-emerald-500 cursor-default' 
                        : 'text-gray-500 hover:text-brand-400'
                    }`}
                  >
                    {task.status === 'Completed' ? (
                      <FiCheckSquare className="h-5.5 w-5.5" />
                    ) : (
                      <FiSquare className="h-5.5 w-5.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-bold text-base tracking-wide truncate ${
                        task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-200'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {/* Priority Badge */}
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border leading-none ${
                        task.priority === 'High' 
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
                          : task.priority === 'Low'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Category Badge */}
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 leading-none">
                        {task.category || 'Other'}
                      </span>
                    </div>

                    {task.description && (
                      <p className={`text-xs text-gray-400 mt-1.5 leading-relaxed ${
                        task.status === 'Completed' ? 'line-through text-gray-600' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}

                    {/* Metadata: Date, Time, Tags */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-500">
                      {task.due_date && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <FiCalendar className="h-3.5 w-3.5 text-brand-400" />
                          Due: {task.due_date}
                        </span>
                      )}
                      {task.due_time && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <FiClock className="h-3.5 w-3.5 text-brand-400" />
                          Time: {task.due_time}
                        </span>
                      )}
                      
                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <FiTag className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, i) => (
                              <span key={i} className="text-[10px] bg-purple-950/25 border border-purple-500/15 text-purple-300 rounded px-1.5 py-0.2 ml-0.5">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit and Delete Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 border-t border-white/5 md:border-none pt-3 md:pt-0">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all focus:outline-none"
                    title="Edit Task"
                  >
                    <FiEdit3 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl border border-white/5 hover:border-rose-500/20 transition-all focus:outline-none"
                    title="Delete Task"
                  >
                    <FiTrash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl h-64">
            <FiCheckSquare className="h-12 w-12 text-gray-600 mb-4 animate-pulse" />
            <h3 className="text-lg font-bold text-white mb-1">No tasks matched your criteria</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Create a new task by clicking the button above or use natural language capture on the dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

    </div>
  );
};

export default Tasks;
