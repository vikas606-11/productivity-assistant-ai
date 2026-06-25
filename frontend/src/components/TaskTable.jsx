import React from 'react';
import { FiEdit3, FiTrash2, FiSquare, FiCheckSquare, FiCalendar, FiClock } from 'react-icons/fi';

const TaskTable = ({ tasks = [], onCompleteTask, onEditTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-dark-border rounded-xl h-64 bg-dark-card/20">
        <FiCheckSquare className="h-10 w-10 text-gray-600 mb-3" />
        <h3 className="text-sm font-bold text-white mb-1">No tasks matched your criteria</h3>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          Create a new task by clicking the button above or use natural language capture.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-dark-border bg-dark-card/30">
      <table className="w-full border-collapse text-left text-xs text-gray-400">
        <thead className="bg-[#141414] border-b border-dark-border text-[9px] font-bold uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3.5 w-12 text-center">Status</th>
            <th className="px-5 py-3.5">Task Info</th>
            <th className="px-5 py-3.5 w-28">Priority</th>
            <th className="px-5 py-3.5 w-28">Category</th>
            <th className="px-5 py-3.5">Tags</th>
            <th className="px-5 py-3.5 w-36">Due Date</th>
            <th className="px-5 py-3.5 w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border bg-transparent font-medium">
          {tasks.map((task) => (
            <tr 
              key={task.id} 
              className={`hover:bg-white/[0.01] transition-colors ${
                task.status === 'Completed' ? 'opacity-65' : ''
              }`}
            >
              {/* Status Checked column */}
              <td className="px-5 py-4 text-center">
                <button
                  type="button"
                  onClick={() => task.status !== 'Completed' && onCompleteTask(task.id)}
                  disabled={task.status === 'Completed'}
                  className={`focus:outline-none transition-transform hover:scale-105 duration-200 ${
                    task.status === 'Completed' 
                      ? 'text-emerald-500 cursor-default' 
                      : 'text-gray-600 hover:text-brand-500'
                  }`}
                >
                  {task.status === 'Completed' ? (
                    <FiCheckSquare className="h-5 w-5" />
                  ) : (
                    <FiSquare className="h-5 w-5" />
                  )}
                </button>
              </td>

              {/* Task Title & Description column */}
              <td className="px-5 py-4 max-w-xs md:max-w-md">
                <span className={`block text-sm font-bold truncate ${
                  task.status === 'Completed' ? 'text-gray-500 line-through font-medium' : 'text-gray-200'
                }`}>
                  {task.title}
                </span>
                {task.description && (
                  <span className={`block text-[11px] text-gray-500 truncate mt-1 ${
                    task.status === 'Completed' ? 'line-through text-gray-600' : ''
                  }`}>
                    {task.description}
                  </span>
                )}
              </td>

              {/* Priority Badge column */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest border leading-none ${
                  task.priority === 'High' 
                    ? 'bg-rose-500/15 border-rose-500/25 text-rose-400' 
                    : task.priority === 'Low'
                      ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                      : 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                }`}>
                  {task.priority}
                </span>
              </td>

              {/* Category Pill column */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-dark-border text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-none">
                  {task.category || 'Other'}
                </span>
              </td>

              {/* Tags column */}
              <td className="px-5 py-4">
                {task.tags && task.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-purple-950/20 border border-purple-500/10 text-purple-300 rounded px-1.5 py-0.2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-600 text-[10px] italic">-</span>
                )}
              </td>

              {/* Due Date column */}
              <td className="px-5 py-4">
                {task.due_date ? (
                  <div className="flex flex-col gap-1 text-[11px] font-semibold text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-3.5 w-3.5 text-brand-500" />
                      {task.due_date}
                    </span>
                    {task.due_time && (
                      <span className="flex items-center gap-1 text-gray-500 font-medium">
                        <FiClock className="h-3 w-3 text-brand-500/50" />
                        {task.due_time}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-600 text-[11px] italic">-</span>
                )}
              </td>

              {/* Actions Button column */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-dark-border transition-all focus:outline-none"
                    title="Edit Task"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-transparent hover:border-rose-500/20 transition-all focus:outline-none"
                    title="Delete Task"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
