import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { useToast } from '../components/Toast';
import TaskModal from '../components/TaskModal';
import { TaskTable } from '../components';
import { 
  FiPlus, 
  FiSearch, 
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

      {/* Tasks Table Container */}
      <div className="flex-1 overflow-y-auto min-h-[250px] pb-10">
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <FiLoader className="h-10 w-10 animate-spin text-brand-500" />
          </div>
        ) : (
          <TaskTable
            tasks={filteredTasks}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
          />
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
