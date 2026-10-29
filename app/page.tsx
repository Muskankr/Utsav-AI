'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { EventHero } from '@/components/EventHero';
import { NavigationTabs, TabType } from '@/components/NavigationTabs';
import { DashboardView } from '@/components/DashboardView';
import { AIPlanView } from '@/components/AIPlanView';
import { BudgetView } from '@/components/BudgetView';
import { TimelineTasksView } from '@/components/TimelineTasksView';
import { VendorsView } from '@/components/VendorsView';
import { SummaryInviteView } from '@/components/SummaryInviteView';
import { CreateEventModal } from '@/components/CreateEventModal';
import { FullEvent, EventDetails, BudgetItem, TaskItem, VendorItem, ScheduleItem } from '@/types';
import {
  getStoredEvents,
  getActiveEventId,
  setActiveEventId,
  saveEvent,
  deleteEvent,
  resetToSampleData,
} from '@/lib/storage';
import { SAMPLE_EVENT } from '@/lib/sampleData';
import { generateDeterministicPlan } from '@/lib/aiPlanner';
import { Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<FullEvent[]>([SAMPLE_EVENT]);
  const [activeEventId, setActiveId] = useState<string>(SAMPLE_EVENT.details.id);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Initialize from localStorage and check API status on client mount
  useEffect(() => {
    const stored = getStoredEvents();
    const curActiveId = getActiveEventId();
    setEvents(stored);
    setActiveId(curActiveId);

    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasGeminiKey === 'boolean') {
          setHasGeminiKey(data.hasGeminiKey);
        }
      })
      .catch(() => {
        // Fallback demo mode
        setHasGeminiKey(false);
      });

    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeEvent =
    events.find((e) => e.details.id === activeEventId) || events[0] || SAMPLE_EVENT;

  // Handle Event Switching
  const handleSelectEvent = (id: string) => {
    setActiveId(id);
    setActiveEventId(id);
    showToast(`Switched to "${events.find((e) => e.details.id === id)?.details.name}"`);
  };

  // Handle Reset to Sample Data
  const handleResetSample = () => {
    if (window.confirm('Reset all celebrations to default Jaipur Wedding sample data?')) {
      const reset = resetToSampleData();
      setEvents([reset]);
      setActiveId(reset.details.id);
      showToast('Restored evaluator sample celebration data.');
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = () => {
    if (window.confirm(`Are you sure you want to delete "${activeEvent.details.name}"?`)) {
      const updated = deleteEvent(activeEvent.details.id);
      setEvents(updated);
      const newActive = getActiveEventId();
      setActiveId(newActive);
      showToast('Event removed.');
    }
  };

  // Handle AI Blueprint Synthesis
  const handleGenerateAIPlan = async (eventToPlan: FullEvent) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: eventToPlan.details }),
      });

      const data = await res.json();
      if (data.plan) {
        const updatedEvent: FullEvent = {
          ...eventToPlan,
          plan: data.plan,
        };
        saveEvent(updatedEvent);
        setEvents((prev) =>
          prev.map((e) => (e.details.id === updatedEvent.details.id ? updatedEvent : e))
        );
        showToast(data.message || 'Personalized AI Celebration Plan ready!');
      } else {
        throw new Error(data.error || 'Failed to craft plan');
      }
    } catch (err: unknown) {
      console.warn('AI endpoint issue, applying deterministic plan fallback:', err);
      const fallbackPlan = generateDeterministicPlan(eventToPlan.details);
      const updatedEvent: FullEvent = {
        ...eventToPlan,
        plan: fallbackPlan,
      };
      saveEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.details.id === updatedEvent.details.id ? updatedEvent : e))
      );
      showToast('Synthesized plan with Utsav AI Demo Engine.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle Create Event Submission
  const handleCreateEvent = async (
    details: Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>,
    autoGenerateAi: boolean
  ) => {
    const newId = `utsav-event-${Date.now()}`;
    const fullDetails: EventDetails = {
      ...details,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Initialize standard Indian celebration budget items
    const defaultBudgetItems: BudgetItem[] = [
      {
        id: `b-${Date.now()}-1`,
        category: 'venue',
        name: 'Venue Rental & Facilities',
        allocated: Math.round(details.budget * 0.28),
        spent: 0,
        notes: 'Main banquet or heritage lawn booking',
      },
      {
        id: `b-${Date.now()}-2`,
        category: 'catering',
        name: `${details.dietary.replace('_', ' ')} Catering (${details.guestCount} Pax)`,
        allocated: Math.round(details.budget * 0.32),
        spent: 0,
        notes: 'Welcome drinks, live counters & feast',
      },
      {
        id: `b-${Date.now()}-3`,
        category: 'decoration',
        name: `${details.theme || 'Floral'} Decor & Lighting`,
        allocated: Math.round(details.budget * 0.15),
        spent: 0,
        notes: 'Stage, entrance arch & atmospheric lights',
      },
      {
        id: `b-${Date.now()}-4`,
        category: 'photography',
        name: 'Candid Photography & Cinematic Film',
        allocated: Math.round(details.budget * 0.09),
        spent: 0,
        notes: 'Photo team and teaser video',
      },
      {
        id: `b-${Date.now()}-5`,
        category: 'entertainment',
        name: 'Music, Sound System & Artists',
        allocated: Math.round(details.budget * 0.06),
        spent: 0,
        notes: 'Live musicians, sound console & host',
      },
      {
        id: `b-${Date.now()}-6`,
        category: 'transport',
        name: 'Guest Shuttles & Logistics',
        allocated: Math.round(details.budget * 0.04),
        spent: 0,
        notes: 'Transit from station/airport',
      },
      {
        id: `b-${Date.now()}-7`,
        category: 'contingency',
        name: 'Reserve & Miscellaneous Contingency',
        allocated: Math.round(details.budget * 0.06),
        spent: 0,
        notes: 'Emergency buffer fund',
      },
    ];

    // Initial basic tasks
    const initialTasks: TaskItem[] = [
      {
        id: `t-${Date.now()}-1`,
        title: `Lock in venue for ${details.name} in ${details.city}`,
        category: 'Venue',
        dueDate: details.date,
        priority: 'high',
        completed: false,
        phase: 'early_planning',
      },
      {
        id: `t-${Date.now()}-2`,
        title: `Finalize catering menu for ${details.guestCount} guests`,
        category: 'Catering',
        dueDate: details.date,
        priority: 'high',
        completed: false,
        phase: 'early_planning',
      },
      {
        id: `t-${Date.now()}-3`,
        title: 'Send out digital Save-the-Date invites',
        category: 'Invitations',
        dueDate: details.date,
        priority: 'medium',
        completed: false,
        phase: 'month_before',
      },
    ];

    const initialSchedule: ScheduleItem[] = [
      {
        id: `s-${Date.now()}-1`,
        time: '10:00 AM',
        title: 'Morning Setup & Floral Delivery',
        description: 'Decorators and technical team access venue',
      },
      {
        id: `s-${Date.now()}-2`,
        time: '04:30 PM',
        title: 'Guest Welcome & High Tea',
        description: 'Arrival of family and friends with welcome coolers',
      },
      {
        id: `s-${Date.now()}-3`,
        time: '07:00 PM',
        title: 'Main Celebration Ceremony & Speeches',
        description: 'Key auspicious moments and milestones',
      },
      {
        id: `s-${Date.now()}-4`,
        time: '08:30 PM',
        title: 'Banquet Feast & Dinner Buffet',
        description: `Buffet open for all ${details.guestCount} guests`,
      },
    ];

    const newEvent: FullEvent = {
      details: fullDetails,
      plan: null,
      budgetItems: defaultBudgetItems,
      tasks: initialTasks,
      schedule: initialSchedule,
      vendors: [],
    };

    saveEvent(newEvent);
    setEvents((prev) => [newEvent, ...prev]);
    setActiveId(newId);
    setIsCreateModalOpen(false);
    showToast(`"${details.name}" created successfully!`);

    if (autoGenerateAi) {
      await handleGenerateAIPlan(newEvent);
    }
  };

  // Sync AI budget ratio to budget items
  const handleApplyBudgetRatio = (ratio: Record<string, number>) => {
    const updated = activeEvent.budgetItems.map((item) => {
      const pct = ratio[item.category];
      if (pct !== undefined) {
        return {
          ...item,
          allocated: Math.round((activeEvent.details.budget * pct) / 100),
        };
      }
      return item;
    });

    const nextEvent = { ...activeEvent, budgetItems: updated };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast('Updated budget allocations according to AI blueprint!');
  };

  // Import AI suggested tasks
  const handleImportSuggestedTasks = () => {
    if (!activeEvent.plan?.suggestedTasks) return;

    const existingTitles = new Set(activeEvent.tasks.map((t) => t.title.toLowerCase()));
    const targetDate = new Date(activeEvent.details.date);

    const newTasks: TaskItem[] = [];
    activeEvent.plan.suggestedTasks.forEach((st, idx) => {
      if (!existingTitles.has(st.title.toLowerCase())) {
        const dueDateObj = new Date(targetDate);
        dueDateObj.setDate(dueDateObj.getDate() - (st.offsetDaysBefore || 0));
        const dueDateStr = dueDateObj.toISOString().split('T')[0];

        newTasks.push({
          id: `task-ai-${Date.now()}-${idx}`,
          title: st.title,
          category: 'AI Milestone',
          dueDate: dueDateStr,
          priority: st.priority,
          completed: false,
          phase: st.phase,
        });
      }
    });

    if (newTasks.length === 0) {
      showToast('All suggested tasks are already on your checklist!');
      return;
    }

    const updatedTasks = [...activeEvent.tasks, ...newTasks];
    const nextEvent = { ...activeEvent, tasks: updatedTasks };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast(`Added ${newTasks.length} curated milestones to Checklist!`);
  };

  // State handlers for components
  const handleUpdateBudgetItems = (items: BudgetItem[]) => {
    const nextEvent = { ...activeEvent, budgetItems: items };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast('Budget items updated.');
  };

  const handleUpdateTotalBudget = (newBudget: number) => {
    const nextEvent: FullEvent = {
      ...activeEvent,
      details: { ...activeEvent.details, budget: newBudget },
    };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast('Total budget updated.');
  };

  const handleUpdateTasks = (tasks: TaskItem[]) => {
    const nextEvent = { ...activeEvent, tasks };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
  };

  const handleUpdateSchedule = (schedule: ScheduleItem[]) => {
    const nextEvent = { ...activeEvent, schedule };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast('Schedule updated.');
  };

  const handleUpdateVendors = (vendors: VendorItem[]) => {
    const nextEvent = { ...activeEvent, vendors };
    saveEvent(nextEvent);
    setEvents((prev) => prev.map((e) => (e.details.id === nextEvent.details.id ? nextEvent : e)));
    showToast('Vendors updated.');
  };

  const handleToggleTask = (taskId: string) => {
    const nextTasks = activeEvent.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    handleUpdateTasks(nextTasks);
  };

  // Budget alert check
  const totalSpent = activeEvent.budgetItems.reduce((acc, i) => acc + (i.spent || 0), 0);
  const budgetAlert = totalSpent > activeEvent.details.budget;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white animate-pulse shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-serif text-lg font-bold text-indigo-950">
            Loading Utsav AI...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-indigo-950 selection:bg-festive-goldLight selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-950 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-elevated border border-indigo-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onResetSample={handleResetSample}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Header Banner */}
        <EventHero
          event={activeEvent}
          onRegenerateAI={() => handleGenerateAIPlan(activeEvent)}
          onDeleteEvent={handleDeleteEvent}
          isAiLoading={isAiLoading}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          taskCount={{
            total: activeEvent.tasks.length,
            completed: activeEvent.tasks.filter((t) => t.completed).length,
          }}
          vendorCount={{
            total: activeEvent.vendors.length,
            confirmed: activeEvent.vendors.filter((v) => v.status === 'confirmed').length,
          }}
          budgetAlert={budgetAlert}
        />

        {/* Tab Content Views */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <DashboardView
              event={activeEvent}
              onNavigateTab={setActiveTab}
              onToggleTask={handleToggleTask}
              onOpenCreateTask={() => setActiveTab('tasks')}
              onOpenCreateVendor={() => setActiveTab('vendors')}
            />
          )}

          {activeTab === 'ai_plan' && (
            <AIPlanView
              event={activeEvent}
              onRegenerate={() => handleGenerateAIPlan(activeEvent)}
              onApplyBudgetRatio={handleApplyBudgetRatio}
              onImportSuggestedTasks={handleImportSuggestedTasks}
              isAiLoading={isAiLoading}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetView
              event={activeEvent}
              onUpdateBudgetItems={handleUpdateBudgetItems}
              onUpdateTotalBudget={handleUpdateTotalBudget}
            />
          )}

          {activeTab === 'tasks' && (
            <TimelineTasksView
              event={activeEvent}
              onUpdateTasks={handleUpdateTasks}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsView
              event={activeEvent}
              onUpdateVendors={handleUpdateVendors}
            />
          )}

          {activeTab === 'invite' && (
            <SummaryInviteView event={activeEvent} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-ivory-300 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-indigo-950 text-sm">
              Utsav AI
            </span>
            <span>•</span>
            <span>PromptWars Virtual Main Challenge 05: Celebration & Event Planner</span>
          </div>
          <p className="flex items-center gap-1 justify-center">
            Crafted with Indian celebration heritage, Next.js & Google Gemini.
          </p>
        </div>
      </footer>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
}
