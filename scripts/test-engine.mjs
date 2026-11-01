
import {
  formatINR,
  formatINRCompact,
  getDaysRemaining,
  formatFriendlyDate,
} from '../lib/currencies.ts';

import { generateDeterministicPlan } from '../lib/aiPlanner.ts';
import { SAMPLE_EVENT } from '../lib/sampleData.ts';

console.log('🧪 Starting Utsav AI Comprehensive Test Suite...\n');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ FAILED: ${message}`);
  }
}

function logSuccess(message) {
  console.log(`✓ ${message}`);
}

// 1. Currency formatting
console.log('--- 1. Currency Formatting ---');

const currencyTests = [
  [0, '₹0'],
  [500, '₹500'],
  [15000, '₹15,000'],
  [250000, '₹2,50,000'],
  [1800000, '₹18,00,000'],
  [25000000, '₹2,50,00,000'],
  [-150000, '-₹1,50,000'],
];

for (const [amount, expected] of currencyTests) {
  const actual = formatINR(amount);
  assert(actual === expected, `formatINR(${amount}): expected ${expected}, got ${actual}`);
  logSuccess(`${amount} => ${actual}`);
}

const compactTests = [
  [0, '₹0'],
  [1500, '₹1.5k'],
  [100000, '₹1 Lakh'],
  [1500000, '₹15 Lakh'],
  [25000000, '₹2.5 Cr'],
  [-1500000, '-₹15 Lakh'],
];

for (const [amount, expected] of compactTests) {
  const actual = formatINRCompact(amount);
  assert(
    actual === expected,
    `formatINRCompact(${amount}): expected ${expected}, got ${actual}`
  );
  logSuccess(`Compact ${amount} => ${actual}`);
}

// 2. Countdown calculations
console.log('\n--- 2. Countdown Calculations ---');

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowStr = [
  tomorrow.getFullYear(),
  String(tomorrow.getMonth() + 1).padStart(2, '0'),
  String(tomorrow.getDate()).padStart(2, '0'),
].join('-');

const tomorrowResult = getDaysRemaining(tomorrowStr);

assert(
  tomorrowResult.days === 1 && tomorrowResult.label === 'Tomorrow',
  'Tomorrow countdown calculation'
);
logSuccess('Tomorrow countdown');

const today = new Date();

const todayStr = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');

const todayResult = getDaysRemaining(todayStr);

assert(
  todayResult.isToday && todayResult.label === 'Happening Today!',
  'Today countdown calculation'
);
logSuccess('Today countdown');

const emptyResult = getDaysRemaining('');

assert(emptyResult.label === 'Date not set', 'Empty date handling');
logSuccess('Empty date handling');

// 3. Friendly date formatting
console.log('\n--- 3. Friendly Date Formatting ---');

assert(
  formatFriendlyDate('') === 'Not scheduled',
  'Empty friendly date formatting'
);

logSuccess('Empty date formatting');

// 4. Event plan generation and quality
console.log('\n--- 4. Event Plan Generation and Quality ---');

const eventTypes = [
  'wedding',
  'birthday',
  'community',
  'anniversary',
  'corporate_gala',
  'pooja_ceremony',
];

const generatedPlans = {};

for (const type of eventTypes) {
  const details = {
    id: `test-${type}`,
    name: `Test ${type} Celebration`,
    type,
    date: '2026-11-20',
    city: 'Jaipur',
    guestCount: 200,
    budget: 1000000,
    dietary: 'pure_veg',
    theme: 'Traditional Heritage',
    preferences: 'Special live music',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const plan = generateDeterministicPlan(details);
  generatedPlans[type] = plan;

  // Basic plan completeness
  assert(
    Boolean(plan.summary?.trim()),
    `${type}: missing summary`
  );

  assert(
    Boolean(plan.themeVision?.primaryTheme?.trim()),
    `${type}: missing primary theme`
  );

  assert(
    plan.themeVision.colorPalette.length >= 3,
    `${type}: insufficient color palette`
  );

  assert(
    plan.themeVision.decorConcepts.length >= 3,
    `${type}: insufficient decor concepts`
  );

  assert(
    plan.cateringHighlights.welcomeDrinks.length > 0,
    `${type}: missing welcome drinks`
  );

  assert(
    plan.cateringHighlights.liveCounters.length > 0,
    `${type}: missing live counters`
  );

  assert(
    plan.cateringHighlights.specialties.length > 0,
    `${type}: missing food specialties`
  );

  assert(
    plan.cateringHighlights.desserts.length > 0,
    `${type}: missing desserts`
  );

  assert(
    plan.entertainmentRituals.length >= 3,
    `${type}: insufficient entertainment or rituals`
  );

  // Task quality
  assert(
    plan.suggestedTasks.length === 10,
    `${type}: expected 10 tasks, received ${plan.suggestedTasks.length}`
  );

  for (const task of plan.suggestedTasks) {
    assert(Boolean(task.title?.trim()), `${type}: task title missing`);

    assert(
      Number.isInteger(task.offsetDaysBefore),
      `${type}: task offset must be an integer`
    );

    assert(
      ['early_planning', 'month_before', 'week_before', 'event_day', 'post_event']
        .includes(task.phase),
      `${type}: invalid task phase ${task.phase}`
    );

    assert(
      ['high', 'medium', 'low'].includes(task.priority),
      `${type}: invalid task priority`
    );
  }

  // Timeline quality
  assert(
    plan.dayOfTimeline.length === 7,
    `${type}: expected 7 timeline entries`
  );

  for (const item of plan.dayOfTimeline) {
    assert(Boolean(item.time), `${type}: timeline time missing`);
    assert(Boolean(item.title?.trim()), `${type}: timeline title missing`);
    assert(Boolean(item.description?.trim()), `${type}: timeline description missing`);
  }

  // Vendor recommendations
  assert(
    plan.vendorRecommendations.length >= 4,
    `${type}: insufficient vendor recommendations`
  );

  for (const vendor of plan.vendorRecommendations) {
    assert(Boolean(vendor.category), `${type}: vendor category missing`);
    assert(
      vendor.keyQuestions.length >= 2,
      `${type}: insufficient vendor questions`
    );
  }

  // Budget ratios
  const ratios = Object.values(plan.recommendedBudgetRatio);

  assert(
    ratios.length > 0,
    `${type}: budget ratios are missing`
  );

  assert(
    ratios.every((value) => Number.isFinite(value) && value >= 0),
    `${type}: budget ratios must be non-negative finite numbers`
  );

  const totalRatio = ratios.reduce((sum, value) => sum + Number(value), 0);

  assert(
    Math.abs(totalRatio - 100) < 0.01,
    `${type}: budget ratios total ${totalRatio}, expected 100`
  );

  // Personalization
  assert(
    plan.summary.includes('Special live music') ||
      plan.themeVision.aestheticVibe.includes('Special live music'),
    `${type}: host preferences were not included`
  );

  assert(
    plan.summary.includes('Jaipur'),
    `${type}: city was not included in summary`
  );

  assert(
    plan.summary.includes('200'),
    `${type}: guest count was not included in summary`
  );

  assert(
    plan.isAiGenerated === false,
    `${type}: deterministic plan should not claim to be AI-generated`
  );

  logSuccess(
    `${type}: ${plan.suggestedTasks.length} tasks, ${plan.dayOfTimeline.length} timeline items, budget ${totalRatio}%`
  );
}

// 5. Event-specific timeline uniqueness
console.log('\n--- 5. Event-Specific Timeline Verification ---');

const timelineSignatures = eventTypes.map((type) =>
  generatedPlans[type].dayOfTimeline
    .map((item) => item.title)
    .join('|')
);

assert(
  new Set(timelineSignatures).size === eventTypes.length,
  'Different event types must have distinct timelines'
);

logSuccess('All six event types have distinct timelines');

// 6. Corporate gala-specific checks
console.log('\n--- 6. Corporate Gala Verification ---');

const corporate = generatedPlans.corporate_gala;

const corporateContent = [
  ...corporate.entertainmentRituals,
  ...corporate.dayOfTimeline.map((item) => `${item.title} ${item.description}`),
  ...corporate.suggestedTasks.map((task) => task.title),
].join(' ').toLowerCase();

assert(
  corporateContent.includes('registration'),
  'Corporate gala should include registration'
);

assert(
  corporateContent.includes('keynote'),
  'Corporate gala should include keynote sessions'
);

assert(
  corporateContent.includes('awards'),
  'Corporate gala should include awards or recognition'
);

logSuccess('Corporate registration, keynote and awards verified');

// 7. Pooja-specific checks
console.log('\n--- 7. Pooja Ceremony Verification ---');

const pooja = generatedPlans.pooja_ceremony;

const poojaContent = [
  ...pooja.entertainmentRituals,
  ...pooja.dayOfTimeline.map((item) => `${item.title} ${item.description}`),
  ...pooja.suggestedTasks.map((task) => task.title),
  ...pooja.cateringHighlights.desserts,
].join(' ').toLowerCase();

assert(
  poojaContent.includes('prasad'),
  'Pooja plan should include prasadam'
);

assert(
  poojaContent.includes('ritual'),
  'Pooja plan should include rituals'
);

logSuccess('Pooja rituals and prasadam verified');

// 8. Dietary recommendation checks
console.log('\n--- 8. Dietary Recommendation Verification ---');

const dietaryTypes = ['pure_veg', 'jain_options', 'multi_cuisine', 'custom'];

for (const dietary of dietaryTypes) {
  const plan = generateDeterministicPlan({
    id: `diet-${dietary}`,
    name: 'Dietary Test Event',
    type: 'wedding',
    date: '2026-11-20',
    city: 'Jaipur',
    guestCount: 100,
    budget: 500000,
    dietary,
    theme: '',
    preferences: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  assert(
    plan.cateringHighlights.specialties.length > 0,
    `${dietary}: missing dietary recommendations`
  );

  assert(
    plan.summary.length > 0,
    `${dietary}: missing dietary summary`
  );

  logSuccess(`${dietary}: catering recommendations generated`);
}

const jainPlan = generateDeterministicPlan({
  id: 'jain-test',
  name: 'Jain Wedding',
  type: 'wedding',
  date: '2026-11-20',
  city: 'Jaipur',
  guestCount: 100,
  budget: 500000,
  dietary: 'jain_options',
  theme: '',
  preferences: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

assert(
  jainPlan.summary.toLowerCase().includes('root vegetables'),
  'Jain plan should explain root vegetable restrictions'
);

logSuccess('Jain dietary restrictions explicitly mentioned');

// 9. Sample event integrity
console.log('\n--- 9. Sample Event Integrity ---');

const event = SAMPLE_EVENT;

assert(Boolean(event.details?.name), 'Sample event name missing');
assert(Boolean(event.plan), 'Sample event plan missing');
assert(event.budgetItems?.length > 0, 'Sample budget items missing');
assert(event.tasks?.length > 0, 'Sample tasks missing');
assert(event.vendors?.length > 0, 'Sample vendors missing');
assert(event.schedule?.length > 0, 'Sample schedule missing');

logSuccess(`Sample Event: ${event.details.name}`);
logSuccess(`Budget items: ${event.budgetItems.length}`);
logSuccess(`Tasks: ${event.tasks.length}`);
logSuccess(`Vendors: ${event.vendors.length}`);
logSuccess(`Schedule: ${event.schedule.length}`);

console.log('\n🎉 ALL UTSAV AI TESTS PASSED!\n');
