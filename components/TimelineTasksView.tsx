'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Filter,
  Check,
  X,
  Edit2,
  ChevronDown,
} from 'lucide-react';
import { FullEvent, TaskItem, ScheduleItem, TaskPriority, TaskPhase } from '@/types';
import { formatFriendlyDate, getDaysRemaining } from '@/lib/currencies';
import confetti from 'canvas-confetti';

interface TimelineTasksViewProps {
  event: FullEvent;
  onUpdateTasks: (tasks: TaskItem[]) => void;
  onUpdateSchedule: (schedule: ScheduleItem[]) => void;
}

const PHASE_LABELS: Record<TaskPhase, string> = {
  early_planning: 'Early Planning (2-4 Months Before)',
  month_before: '1 Month Before',
  week_before: 'Final Week Countdown',
  event_day: 'Event Day Execution',
  post_event: 'Post-Event Wrap-up',
};

export function TimelineTasksView({
  event,
  onUpdateTasks,
  onUpdateSchedule,
}: TimelineTasksViewProps) {
  const { details, tasks, schedule } = event;

  const [activeSection, setActiveSection] = useState<'checklist' | 'schedule'>('checklist');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);

  // Add Task Modal State
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('General');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskPhase, setTaskPhase] = useState<TaskPhase>('month_before');
  const [taskAssignee, setTaskAssignee] = useState('');

  // Add Schedule Item Modal State
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [schedTime, setSchedTime] = useState('06:00 PM');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDesc, setSchedDesc] = useState('');
  const [schedLoc, setSchedLoc] = useState('');
  const [schedInCharge, setSchedInCharge] = useState('');

  // Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (hideCompleted && t.completed) return false;
    if (filterPhase !== 'all' && t.phase !== filterPhase) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleToggleTask = (id: string) => {
    const next = tasks.map((t) => {
      if (t.id === id) {
        const willBeCompleted = !t.completed;
        if (willBeCompleted) {
          // Trigger subtle celebration confetti!
          try {
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#E11D48', '#D97706', '#1E1B4B', '#10B981'],
            });
          } catch {
            // ignore if unsupported
          }
        }
        return { ...t, completed: willBeCompleted };
      }
      return t;
    });
    onUpdateTasks(next);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory.trim() || 'General',
      dueDate: taskDueDate || details.date,
      priority: taskPriority,
      completed: false,
      phase: taskPhase,
      assignedTo: taskAssignee.trim() || undefined,
    };

    onUpdateTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
    setTaskTitle('');
    setTaskDueDate('');
    setTaskAssignee('');
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;

    const newSched: ScheduleItem = {
      id: `sched-${Date.now()}`,
      time: schedTime.trim(),
      title: schedTitle.trim(),
      description: schedDesc.trim(),
      location: schedLoc.trim() || undefined,
      inCharge: schedInCharge.trim() || undefined,
    };

    onUpdateSchedule([...schedule, newSched]);
    setIsAddScheduleOpen(false);
    setSchedTitle('');
    setSchedDesc('');
    setSchedLoc('');
    setSchedInCharge('');
  };

  const handleDeleteSchedule = (id: string) => {
    onUpdateSchedule(schedule.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Switcher: Checklist vs Event-Day Schedule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-300 shadow-soft">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('checklist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'checklist'
                ? 'bg-indigo-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-ivory-100'
            }`}
          >
            Planning Checklist ({completedTasks}/{totalTasks})
          </button>

          <button
            onClick={() => setActiveSection('schedule')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'schedule'
                ? 'bg-indigo-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-ivory-100'
            }`}
          >
            Event-Day Run of Show ({schedule.length} Milestones)
          </button>
        </div>

        {activeSection === 'checklist' ? (
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAddScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event-Day Milestone</span>
          </button>
        )}
      </div>

      {activeSection === 'checklist' ? (
        /* SECTION 1: PLANNING CHECKLIST */
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-950">
                  Planning Progress: {progressPct}% Completed
                </h3>
                <p className="text-xs text-slate-500">
                  {completedTasks} completed • {totalTasks - completedTasks} remaining
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterPhase}
                  onChange={(e) => setFilterPhase(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-ivory-300 text-xs bg-ivory-50 text-slate-700 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">All Phases</option>
                  {Object.entries(PHASE_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-ivory-300 text-xs bg-ivory-50 text-slate-700 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={(e) => setHideCompleted(e.target.checked)}
                    className="rounded border-ivory-400 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Hide Done</span>
                </label>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-ivory-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-festive-saffron to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2.5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const dateMeta = getDaysRemaining(task.dueDate);
                const isOverdue = !task.completed && dateMeta.isPast;

                return (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-ivory-100/50 border-ivory-200 opacity-60'
                        : isOverdue
                        ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                        : 'bg-white border-ivory-300 shadow-soft hover:border-ivory-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="w-5 h-5 mt-0.5 rounded border-ivory-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-semibold leading-snug ${
                            task.completed
                              ? 'line-through text-slate-500'
                              : 'text-indigo-950'
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                          <span className="font-medium text-slate-700 bg-ivory-200 px-2 py-0.5 rounded">
                            {task.category}
                          </span>

                          <span className="text-slate-400">•</span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatFriendlyDate(task.dueDate)}</span>
                          </span>

                          {isOverdue && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                              task.priority === 'high'
                                ? 'bg-rose-100 text-rose-800'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {task.assignedTo && (
                            <span className="text-indigo-900 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                              Assigned: {task.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-ivory-300">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-600">
                  No tasks matching the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SECTION 2: EVENT-DAY RUN OF SHOW */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-indigo-950">
              Celebration Day Chronological Run of Show
            </h3>
            <p className="text-xs text-slate-500">
              Hour-by-hour sequence of ceremonies, feast timings, and logistics leads for {formatFriendlyDate(details.date)}.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-ivory-300">
            {schedule.map((item, idx) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Timeline node */}
                <span className="absolute -left-6 sm:-left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white bg-indigo-900 shadow" />

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-amber-300 font-mono text-xs font-bold">
                      {item.time}
                    </span>
                    <h4 className="font-serif text-base font-bold text-indigo-950">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    {item.location && (
                      <span>📍 <strong>Location:</strong> {item.location}</span>
                    )}
                    {item.inCharge && (
                      <span>👤 <strong>Lead:</strong> {item.inCharge}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSchedule(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors self-end sm:self-auto shrink-0"
                  title="Remove milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-elevated border border-ivory-300 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                Add Checklist Task
              </h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Task Milestone
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taste test wedding kachoris, Reconfirm Pandit Samagri"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Venue, Catering, Rituals"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs bg-ivory-50 focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Planning Phase
                  </label>
                  <select
                    value={taskPhase}
                    onChange={(e) => setTaskPhase(e.target.value as TaskPhase)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs bg-ivory-50 focus:ring-1 focus:ring-rose-500"
                  >
                    {Object.entries(PHASE_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Assigned Family Member / Lead
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brother, Uncle, Event Coordinator"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Schedule Milestone Modal */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-elevated border border-ivory-300 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                Add Event-Day Milestone
              </h3>
              <button
                onClick={() => setIsAddScheduleOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Time (e.g. 05:30 PM)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="05:30 PM"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Lead In-Charge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Groom's Brother"
                    value={schedInCharge}
                    onChange={(e) => setSchedInCharge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varmala on Central Stage"
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Activity Details / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rose petal showers from 2nd floor, cold sparklers triggered upon garland exchange."
                  value={schedDesc}
                  onChange={(e) => setSchedDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Location / Area in Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Courtyard Lawn, Main Ballroom"
                  value={schedLoc}
                  onChange={(e) => setSchedLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-semibold shadow-sm"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

