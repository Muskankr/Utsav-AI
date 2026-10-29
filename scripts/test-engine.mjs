import { formatINR, formatINRCompact, getDaysRemaining } from '../lib/currencies.ts';
import { generateDeterministicPlan } from '../lib/aiPlanner.ts';
import { SAMPLE_EVENT } from '../lib/sampleData.ts';

console.log('🧪 Starting Utsav AI Test Suite...');

// 1. Currency Formatting Tests
console.log('\n--- 1. Testing Indian Rupee Formatting ---');
const testAmounts = [0, 500, 15000, 250000, 1800000, 25000000];
for (const amt of testAmounts) {
  console.log(`Amt: ${amt} => Standard: ${formatINR(amt)} | Compact: ${formatINRCompact(amt)}`);
}
if (formatINR(1800000) !== '₹18,00,000') {
  throw new Error(`Expected ₹18,00,000 but got ${formatINR(1800000)}`);
}

// 2. Countdown Calculations
console.log('\n--- 2. Testing Date & Countdown Calculation ---');
const countdown = getDaysRemaining(SAMPLE_EVENT.details.date);
console.log('Event Date:', SAMPLE_EVENT.details.date);
console.log('Countdown result:', countdown);

// 3. Deterministic AI Plan Generator for Multiple Event Types
console.log('\n--- 3. Testing AI Plan Generation across 4 Event Types ---');
const eventTypes = ['wedding', 'birthday', 'community', 'pooja_ceremony'];

for (const t of eventTypes) {
  const plan = generateDeterministicPlan({
    id: `test-${t}`,
    name: `Test ${t} Celebration`,
    type: t,
    date: '2026-11-20',
    city: 'Jaipur',
    guestCount: 200,
    budget: 1000000,
    dietary: 'pure_veg',
    theme: 'Traditional Heritage',
    preferences: 'Special live music',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  if (!plan.summary || !plan.themeVision?.primaryTheme || !plan.cateringHighlights?.welcomeDrinks?.length) {
    throw new Error(`Invalid plan generated for type: ${t}`);
  }
  console.log(`✓ Type "${t}" plan generated successfully: "${plan.themeVision.primaryTheme}" (${plan.suggestedTasks.length} tasks, ${plan.dayOfTimeline.length} schedule nodes)`);
}

// 4. Sample Event Integrity
console.log('\n--- 4. Checking Sample Event Structure ---');
console.log(`Sample Event: "${SAMPLE_EVENT.details.name}"`);
console.log(`Budget items count: ${SAMPLE_EVENT.budgetItems.length}`);
console.log(`Tasks count: ${SAMPLE_EVENT.tasks.length}`);
console.log(`Vendors count: ${SAMPLE_EVENT.vendors.length}`);
console.log(`Schedule count: ${SAMPLE_EVENT.schedule.length}`);

console.log('\n🎉 ALL UTSAV AI ENGINE TESTS PASSED CLEANLY!\n');

