import React, { useState, useMemo } from 'react';
import { 
  Kanban, Plus, ChevronRight, ChevronLeft, Trash2, CheckCircle2, 
  Clock, AlertTriangle, Search, Filter, LayoutGrid, X 
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  columnId: 'backlog' | 'in-progress' | 'review' | 'shipped';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignee: { name: string; avatar: string };
  tag: string;
  dueInDays: number;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Migrate REST endpoints to Edge functions',
    description: 'Reduce server latency from 180ms to sub-30ms using globally distributed edge handlers.',
    columnId: 'shipped',
    priority: 'high',
    assignee: { name: 'Sameer', avatar: 'SD' },
    tag: 'Backend',
    dueInDays: 0,
  },
  {
    id: 'task-2',
    title: 'Implement 60FPS Canvas physics engine',
    description: 'Refactor entity rendering loop with requestAnimationFrame and spatial partition grid.',
    columnId: 'shipped',
    priority: 'urgent',
    assignee: { name: 'Sameer', avatar: 'SD' },
    tag: 'Core UI',
    dueInDays: 0,
  },
  {
    id: 'task-3',
    title: 'WCAG AAA Color Contrast Accessibility Audit',
    description: 'Audit palette tokens and ensure minimum 7:1 ratio for high contrast reader mode.',
    columnId: 'review',
    priority: 'medium',
    assignee: { name: 'Elena', avatar: 'ER' },
    tag: 'Design',
    dueInDays: 2,
  },
  {
    id: 'task-4',
    title: 'Real-time WebSocket multiplayer cursor sync',
    description: 'Integrate collaborative canvas cursor broadcasts with binary ArrayBuffer compression.',
    columnId: 'in-progress',
    priority: 'urgent',
    assignee: { name: 'Marcus', avatar: 'ML' },
    tag: 'Networking',
    dueInDays: 1,
  },
  {
    id: 'task-5',
    title: 'Stripe 3D Secure checkout webhook handler',
    description: 'Add idempotent webhook listener for subscription upgrades and automatic receipt emails.',
    columnId: 'in-progress',
    priority: 'high',
    assignee: { name: 'Sameer', avatar: 'SD' },
    tag: 'Payments',
    dueInDays: 3,
  },
  {
    id: 'task-6',
    title: 'Dark / Light theme system tokens sync',
    description: 'Extract raw hex variables into semantic Tailwind design system tokens.',
    columnId: 'backlog',
    priority: 'low',
    assignee: { name: 'Sarah', avatar: 'SK' },
    tag: 'Styling',
    dueInDays: 5,
  },
];

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'border-slate-300' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-500' },
  { id: 'review', title: 'Code Review', color: 'border-amber-500' },
  { id: 'shipped', title: 'Shipped', color: 'border-emerald-500' },
] as const;

export const SaasDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('high');
  const [newColumn, setNewColumn] = useState<Task['columnId']>('backlog');
  const [newTag, setNewTag] = useState<string>('Feature');

  // Move task left or right
  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    const colOrder: Task['columnId'][] = ['backlog', 'in-progress', 'review', 'shipped'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = colOrder.indexOf(t.columnId);
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < colOrder.length) {
          return { ...t, columnId: colOrder[newIndex] };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Interactive task item created in PulseFlow workspace.',
      columnId: newColumn,
      priority: newPriority,
      assignee: { name: 'Sameer', avatar: 'SD' },
      tag: newTag,
      dueInDays: 3,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.columnId === 'shipped').length;
  const inProgressTasks = tasks.filter((t) => t.columnId === 'in-progress').length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-900 font-sans select-none overflow-y-auto">
      {/* Top Workspace Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-950 text-base">PULSEFLOW</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                SPRINT #42
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Agile Kanban Board & Sprint Velocity</p>
          </div>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </header>

      {/* Analytics Metric Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Sprint Progress</div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-extrabold text-slate-900 font-mono text-sm">{completionPct}%</span>
            <span className="text-[10px] text-slate-400 font-mono">{completedTasks}/{totalTasks} Done</span>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Active in Flight</div>
          <div className="text-sm font-extrabold text-blue-600 font-mono mt-1">
            {inProgressTasks} Tasks
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Sprint Velocity</div>
          <div className="text-sm font-extrabold text-amber-600 font-mono mt-1">
            38 Story Points / wk
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Deploy Cycle</div>
          <div className="text-sm font-extrabold text-emerald-600 font-mono mt-1">
            Continuous CI/CD
          </div>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 text-[11px]">Priority:</span>
          {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-all ${
                priorityFilter === p
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[760px] md:min-w-0">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.columnId === column.id);

            return (
              <div
                key={column.id}
                className="bg-white/80 rounded-xl border border-slate-200 flex flex-col max-h-[600px] shadow-2xs"
              >
                {/* Column Header */}
                <div className={`p-3 border-b-2 ${column.color} flex items-center justify-between bg-white rounded-t-xl`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                      {column.title}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Body Tasks */}
                <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5">
                  {columnTasks.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                      No tasks in this lane
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priorityColor =
                        task.priority === 'urgent'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : task.priority === 'medium'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200';

                      return (
                        <div
                          key={task.id}
                          className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all space-y-2 group"
                        >
                          {/* Task Badges */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded border ${priorityColor}`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {task.tag}
                            </span>
                          </div>

                          {/* Task Title & Desc */}
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>

                          {/* Task Bottom Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                                {task.assignee.avatar}
                              </span>
                              <span className="text-[10px] text-slate-600">{task.assignee.name}</span>
                            </div>

                            {/* Move Buttons */}
                            <div className="flex items-center gap-1">
                              {column.id !== 'backlog' && (
                                <button
                                  onClick={() => moveTask(task.id, 'prev')}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {column.id !== 'shipped' && (
                                <button
                                  onClick={() => moveTask(task.id, 'next')}
                                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= CREATE TASK MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Create New Agile Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build interactive product carousel"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specify requirements and acceptance criteria..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Column</label>
                  <select
                    value={newColumn}
                    onChange={(e) => setNewColumn(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Tag</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
