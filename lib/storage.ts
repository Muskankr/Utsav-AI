import { FullEvent, EventDetails, BudgetItem, TaskItem, VendorItem, ScheduleItem, AIEventPlan } from '@/types';
import { SAMPLE_EVENT } from './sampleData';

const STORAGE_KEY_EVENTS = 'utsav_ai_events_v1';
const STORAGE_KEY_ACTIVE_ID = 'utsav_ai_active_event_id_v1';

/**
 * Safely parse JSON from localStorage with error recovery
 */
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return fallback;
  }
}

/**
 * Safely save data to localStorage
 */
function safeSet(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing key "${key}" to localStorage:`, err);
    return false;
  }
}

/**
 * Get all stored events. If none exist or corrupted, initialize with SAMPLE_EVENT.
 */
export function getStoredEvents(): FullEvent[] {
  const events = safeGet<FullEvent[]>(STORAGE_KEY_EVENTS, []);
  if (!events || !Array.isArray(events) || events.length === 0) {
    // Seed with sample event for instant evaluator exploration
    const initial = [SAMPLE_EVENT];
    safeSet(STORAGE_KEY_EVENTS, initial);
    safeSet(STORAGE_KEY_ACTIVE_ID, SAMPLE_EVENT.details.id);
    return initial;
  }
  return events;
}

/**
 * Get the currently active event ID
 */
export function getActiveEventId(): string {
  const storedId = safeGet<string | null>(STORAGE_KEY_ACTIVE_ID, null);
  const events = getStoredEvents();
  if (storedId && events.some(e => e.details.id === storedId)) {
    return storedId;
  }
  return events[0]?.details.id || SAMPLE_EVENT.details.id;
}

/**
 * Set the currently active event ID
 */
export function setActiveEventId(id: string): void {
  safeSet(STORAGE_KEY_ACTIVE_ID, id);
}

/**
 * Get the currently active FullEvent object
 */
export function getActiveEvent(): FullEvent {
  const events = getStoredEvents();
  const activeId = getActiveEventId();
  const found = events.find(e => e.details.id === activeId);
  return found || events[0] || SAMPLE_EVENT;
}

/**
 * Save or update a full event
 */
export function saveEvent(event: FullEvent): void {
  const events = getStoredEvents();
  const index = events.findIndex(e => e.details.id === event.details.id);
  let updated: FullEvent[];

  const stampedEvent: FullEvent = {
    ...event,
    details: {
      ...event.details,
      updatedAt: new Date().toISOString(),
    },
  };

  if (index >= 0) {
    updated = [...events];
    updated[index] = stampedEvent;
  } else {
    updated = [stampedEvent, ...events];
  }

  safeSet(STORAGE_KEY_EVENTS, updated);
  safeSet(STORAGE_KEY_ACTIVE_ID, stampedEvent.details.id);
}

/**
 * Delete an event by ID
 */
export function deleteEvent(id: string): FullEvent[] {
  const events = getStoredEvents();
  const filtered = events.filter(e => e.details.id !== id);
  
  if (filtered.length === 0) {
    // If user deletes last event, restore sample event so app is never broken
    const reset = [SAMPLE_EVENT];
    safeSet(STORAGE_KEY_EVENTS, reset);
    safeSet(STORAGE_KEY_ACTIVE_ID, SAMPLE_EVENT.details.id);
    return reset;
  }

  safeSet(STORAGE_KEY_EVENTS, filtered);
  const currentActive = getActiveEventId();
  if (currentActive === id) {
    safeSet(STORAGE_KEY_ACTIVE_ID, filtered[0].details.id);
  }
  return filtered;
}

/**
 * Hard reset to sample data
 */
export function resetToSampleData(): FullEvent {
  const initial = [SAMPLE_EVENT];
  safeSet(STORAGE_KEY_EVENTS, initial);
  safeSet(STORAGE_KEY_ACTIVE_ID, SAMPLE_EVENT.details.id);
  return SAMPLE_EVENT;
}

/**
 * Helper to update sub-entities inside active event
 */
export function updateActiveEventParts(updates: {
  details?: Partial<EventDetails>;
  plan?: AIEventPlan;
  budgetItems?: BudgetItem[];
  tasks?: TaskItem[];
  schedule?: ScheduleItem[];
  vendors?: VendorItem[];
}): FullEvent {
  const current = getActiveEvent();
  const next: FullEvent = {
    ...current,
    details: updates.details ? { ...current.details, ...updates.details } : current.details,
    plan: updates.plan !== undefined ? updates.plan : current.plan,
    budgetItems: updates.budgetItems !== undefined ? updates.budgetItems : current.budgetItems,
    tasks: updates.tasks !== undefined ? updates.tasks : current.tasks,
    schedule: updates.schedule !== undefined ? updates.schedule : current.schedule,
    vendors: updates.vendors !== undefined ? updates.vendors : current.vendors,
  };
  saveEvent(next);
  return next;
}

