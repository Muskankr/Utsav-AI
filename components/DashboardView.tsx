'use client';

import React from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { FullEvent } from '@/types';
import { formatINR, formatINRCompact, getDaysRemaining } from '@/lib/currencies';
import { TabType } from './NavigationTabs';

interface DashboardViewProps {
  event: FullEvent;
  onNavigateTab: (tab: TabType) => void;
  onToggleTask: (taskId: string) => void;
  onOpenCreateTask: () => void;
  onOpenCreateVendor: () => void;
}

export function DashboardView({
  event,
  onNavigateTab,
  onToggleTask,
  onOpenCreateTask,
  onOpenCreateVendor,
}: DashboardViewProps) {
  const { details, plan, budgetItems, tasks, vendors, schedule } = event;

  // Compute budget statistics
  const totalBudget = details.budget;
  const totalAllocated = budgetItems.reduce((acc, item) => acc + (item.allocated || 0), 0);
  const totalSpent = budgetItems.reduce((acc, item) => acc + (item.spent || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;
  const budgetSpentPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const costPerGuest = details.guestCount > 0 ? Math.round(totalBudget / details.guestCount) : 0;

  // Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  // Vendor statistics
  const totalVendors = vendors.length;
  const confirmedVendors = vendors.filter((v) => v.status === 'confirmed').length;

  const countdown = getDaysRemaining(details.date);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Budget */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Budget Status
            </span>
            <div className={`p-2 rounded-xl ${isOverBudget ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl sm:text-2xl font-bold font-serif text-indigo-950">
                {formatINRCompact(totalSpent)}
              </span>
              <span className="text-xs text-slate-500">
                of {formatINRCompact(totalBudget)}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-rose-500' : 'bg-festive-saffron'
                }`}
                style={{ width: `${budgetSpentPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 flex items-center justify-between">
              <span>{isOverBudget ? 'Over by' : 'Remaining'}:</span>
              <span className={`font-semibold ${isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatINR(Math.abs(remainingBudget))}
              </span>
            </p>
          </div>
        </div>

        {/* Metric 2: Tasks Done */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Planning Checklist
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl sm:text-2xl font-bold font-serif text-indigo-950">
                {taskProgressPct}%
              </span>
              <span className="text-xs text-slate-500">
                {completedTasks} of {totalTasks} done
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 flex items-center justify-between">
              <span>Remaining milestones:</span>
              <span className="font-semibold text-indigo-950">
                {totalTasks - completedTasks}
              </span>
            </p>
          </div>
        </div>

        {/* Metric 3: Vendors */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vendor Contracts
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl sm:text-2xl font-bold font-serif text-indigo-950">
                {confirmedVendors}
              </span>
              <span className="text-xs text-slate-500">
                of {totalVendors} confirmed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{
                  width: totalVendors > 0 ? `${(confirmedVendors / totalVendors) * 100}%` : '0%',
                }}
              />
            </div>
            <p className="text-xs text-slate-600 flex items-center justify-between">
              <span>Pipeline:</span>
              <span className="font-semibold text-slate-700">
                {totalVendors - confirmedVendors} prospective/negotiating
              </span>
            </p>
          </div>
        </div>

        {/* Metric 4: Hospitality & Guests */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hospitality & Scale
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl sm:text-2xl font-bold font-serif text-indigo-950">
                {details.guestCount}
              </span>
              <span className="text-xs text-slate-500">
                Guests expected
              </span>
            </div>
            <div className="text-xs text-slate-600 py-1 flex items-center justify-between border-t border-ivory-200 mt-2">
              <span>Budget per guest:</span>
              <span className="font-semibold text-indigo-950">
                ~{formatINR(costPerGuest)}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between mt-1">
              <span>Location:</span>
              <span className="truncate max-w-[130px] font-medium text-slate-700">
                {details.city || 'India'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overbudget Warning Banner (if applicable) */}
      {isOverBudget && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-rose-800">
            <p className="font-semibold">
              Warning: Estimated commitments exceed overall budget by {formatINR(Math.abs(remainingBudget))}.
            </p>
            <p className="mt-0.5 text-rose-700">
              Review allocations in the Budget tab or adjust vendor commitments to preserve contingency reserves.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column (Vision & Timeline) + Right Column (Checklist & Vendors) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): AI Blueprint Vision & Run-of-Show */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Blueprint Preview Card */}
          <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-indigo-950">
                    Celebration Blueprint
                  </h3>
                  <p className="text-xs text-slate-500">
                    {plan?.modelUsed || 'AI Curated Celebration Strategy'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('ai_plan')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <span>Full Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {plan ? (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-ivory-50 p-4 rounded-xl border border-ivory-200">
                  {plan.summary}
                </p>

                {/* Color Palette & Primary Theme */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Aesthetic Palette
                    </span>
                    <div className="flex items-center gap-2">
                      {plan.themeVision?.colorPalette?.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      <span className="text-xs text-slate-600 font-medium ml-1">
                        {plan.themeVision?.primaryTheme}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Dietary Highlight
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      {details.dietary.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Highlights tags */}
                <div className="pt-2 border-t border-ivory-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Decor & Atmosphere Concepts
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.themeVision?.decorConcepts?.slice(0, 2).map((concept, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-700 p-2.5 rounded-lg bg-ivory-100/70 border border-ivory-200"
                      >
                        • {concept}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 mb-3">No AI plan generated yet.</p>
                <button
                  onClick={() => onNavigateTab('ai_plan')}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                >
                  Generate Plan Now
                </button>
              </div>
            )}
          </div>

          {/* Event Day Schedule Sneak Peek */}
          <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-indigo-950">
                    Event Day Run of Show
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chronological milestone schedule
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {(schedule && schedule.length > 0 ? schedule.slice(0, 4) : []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-ivory-50/70 border border-ivory-200"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-900 text-amber-300 font-mono text-xs font-bold shrink-0">
                    {item.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-indigo-950 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  {item.inCharge && (
                    <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-slate-600 shrink-0">
                      {item.inCharge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Priority Action Checklist & Quick Actions */}
        <div className="space-y-6">
          {/* Urgent Checklist Card */}
          <div className="bg-white rounded-2xl border border-ivory-300 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-serif text-base font-bold text-indigo-950">
                  Priority Action Checklist
                </h3>
              </div>
              <button
                onClick={onOpenCreateTask}
                className="p-1 rounded-lg hover:bg-ivory-200 text-slate-600 transition-colors"
                title="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-ivory-200 hover:bg-ivory-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-ivory-400 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-2">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">
                          Due: {task.dueDate || 'Flexible'}
                        </span>
                        {task.priority === 'high' && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center rounded-xl bg-emerald-50 text-emerald-800 text-xs">
                  🎉 All listed tasks completed!
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="w-full mt-3 py-2 text-center text-xs font-semibold text-slate-600 hover:text-indigo-950 border-t border-ivory-200 flex items-center justify-center gap-1"
            >
              <span>Manage all {totalTasks} tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Confirmed Vendors Card */}
          <div className="bg-white rounded-2xl border border-ivory-300 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-base font-bold text-indigo-950">
                  Key Vendors
                </h3>
              </div>
              <button
                onClick={onOpenCreateVendor}
                className="p-1 rounded-lg hover:bg-ivory-200 text-slate-600 transition-colors"
                title="Add vendor"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {vendors.slice(0, 4).map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-ivory-200 text-xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-indigo-950 truncate">
                      {vendor.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {vendor.category} • {formatINR(vendor.estimatedPrice)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                      vendor.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vendor.status === 'negotiating'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-ivory-200 text-slate-600'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('vendors')}
              className="w-full mt-3 py-2 text-center text-xs font-semibold text-slate-600 hover:text-indigo-950 border-t border-ivory-200 flex items-center justify-center gap-1"
            >
              <span>Manage vendors directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Share / Invitation Shortcut */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-soft">
            <h4 className="font-serif text-sm font-bold text-amber-300 mb-1">
              Guest Invitations & Summary
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              One-click WhatsApp invite draft with venue details and date.
            </p>
            <button
              onClick={() => onNavigateTab('invite')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white border border-white/20 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Generate Invitation Copy</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

