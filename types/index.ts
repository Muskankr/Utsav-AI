export type EventType =
  | 'wedding'
  | 'birthday'
  | 'community'
  | 'anniversary'
  | 'corporate_gala'
  | 'pooja_ceremony';

export type DietaryRequirement =
  | 'pure_veg'
  | 'jain_options'
  | 'multi_cuisine'
  | 'regional_specialty'
  | 'custom';

export type VendorStatus =
  | 'prospective'
  | 'shortlisted'
  | 'negotiating'
  | 'confirmed'
  | 'declined';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskPhase =
  | 'early_planning'
  | 'month_before'
  | 'week_before'
  | 'event_day'
  | 'post_event';

export type BudgetCategoryKey =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'entertainment'
  | 'transport'
  | 'contingency'
  | 'attire_beauty'
  | 'gifts_favors';

export interface EventDetails {
  id: string;
  name: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  city: string;
  guestCount: number;
  budget: number; // In INR
  theme: string;
  dietary: DietaryRequirement;
  preferences: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  category: BudgetCategoryKey;
  name: string;
  allocated: number;
  spent: number;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  completed: boolean;
  phase: TaskPhase;
  assignedTo?: string;
}

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "04:30 PM"
  title: string;
  description: string;
  location?: string;
  inCharge?: string;
}

export interface VendorItem {
  id: string;
  category: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedPrice: number;
  status: VendorStatus;
  notes?: string;
}

export interface ThemeVision {
  primaryTheme: string;
  colorPalette: string[];
  aestheticVibe: string;
  decorConcepts: string[];
}

export interface CateringHighlights {
  welcomeDrinks: string[];
  liveCounters: string[];
  specialties: string[];
  desserts: string[];
}

export interface SuggestedTask {
  title: string;
  phase: TaskPhase;
  priority: TaskPriority;
  offsetDaysBefore: number;
}

export interface VendorRecommendation {
  category: string;
  keyQuestions: string[];
  estimatedSharePercent: number;
}

export interface AIEventPlan {
  summary: string;
  themeVision: ThemeVision;
  cateringHighlights: CateringHighlights;
  entertainmentRituals: string[];
  recommendedBudgetRatio: Record<string, number>;
  suggestedTasks: SuggestedTask[];
  dayOfTimeline: Array<{ time: string; title: string; description: string }>;
  vendorRecommendations: VendorRecommendation[];
  isAiGenerated: boolean;
  modelUsed?: string;
  generatedAt: string;
}

export interface FullEvent {
  details: EventDetails;
  plan: AIEventPlan | null;
  budgetItems: BudgetItem[];
  tasks: TaskItem[];
  schedule: ScheduleItem[];
  vendors: VendorItem[];
}

