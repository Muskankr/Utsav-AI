'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  IndianRupee,
  CheckSquare,
  Users,
  Send,
} from 'lucide-react';

export type TabType = 'overview' | 'ai_plan' | 'budget' | 'tasks' | 'vendors' | 'invite';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  taskCount: { total: number; completed: number };
  vendorCount: { total: number; confirmed: number };
  budgetAlert?: boolean;
}

export function NavigationTabs({
  activeTab,
  onTabChange,
  taskCount,
  vendorCount,
  budgetAlert,
}: NavigationTabsProps) {
  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'ai_plan' as TabType,
      label: 'AI Planner',
      icon: Sparkles,
      badge: 'GenAI',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'budget' as TabType,
      label: 'Budget & Costs',
      icon: IndianRupee,
      badge: budgetAlert ? 'Over Budget' : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 animate-pulse',
    },
    {
      id: 'tasks' as TabType,
      label: 'Timeline & Tasks',
      icon: CheckSquare,
      count: `${taskCount.completed}/${taskCount.total}`,
    },
    {
      id: 'vendors' as TabType,
      label: 'Vendors',
      icon: Users,
      count: `${vendorCount.confirmed}/${vendorCount.total} Booked`,
    },
    {
      id: 'invite' as TabType,
      label: 'Invites & Summary',
      icon: Send,
    },
  ];

  return (
    <div className="border-b border-ivory-300 bg-white/60 backdrop-blur-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-indigo-950 hover:bg-ivory-200/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}

                {tab.count && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-indigo-100'
                        : 'bg-ivory-200 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

