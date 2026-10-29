# Utsav AI — Premier GenAI Celebration & Event Planner

> **PromptWars Virtual Main Challenge 05: Celebration & Event Planner**  
> *A submission-ready, production-grade Next.js SaaS MVP for Indian weddings, milestone birthdays, cultural festivals, and community celebrations.*

---

## 🌟 Executive Overview

**Utsav AI** (उत्सव) is an intelligent celebration operating system designed specifically for the vibrancy, complexity, and scale of Indian gatherings. From palace weddings in Jaipur to community Diwali festivals, milestone birthdays, and Vedic poojas, Utsav AI bridges the gap between vision and execution.

### Key Capabilities
- **Curated AI Celebration Masterplan**: Synthesizes aesthetic concepts, color palettes, floral mandap installations, authentic multi-cuisine menus (Pure Veg, Jain, Regional, or Multi-cuisine), cultural rituals, and timeline pacing.
- **Dynamic INR Budget Estimator**: Tracks Venue, Catering, Decoration, Photography, Entertainment, Transport, and Contingencies with real-time recalculations and overspending alerts.
- **Actionable Planning Checklist & Run-of-Show**: Phase-based milestones (from 4 months out to day-of coordination) with overdue indicators and celebratory confetti upon task completion.
- **Vendor Pipeline Organizer**: Tracks prospective leads, shortlisted contenders, and confirmed bookings with contact information and direct WhatsApp/call actions.
- **Guest Invitations & Executive Dossier**: One-click copyable WhatsApp and email invite templates, plus a printable executive summary.
- **Zero-Friction Evaluator Experience**: Pre-seeded with a rich sample event (*"Aarav & Meera's Royal Jaipur Wedding"*) and a one-click sample reset button. Runs out-of-the-box in **Demo Mode** or connects to **Google Gemini 1.5 Flash** when an API key is provided.

---

## 🎨 Design & Aesthetic System

Built around Indian festive warmth and modern SaaS elegance:
- **Warm Ivory Backgrounds** (`#FAF7F2`, `#FDFAF6`): Clean, creamy canvas inspired by raw tussar silk and hand-laid paper.
- **Deep Indigo & Midnight Slate** (`#0F172A`, `#1E1B4B`): Regal, grounding typography and high-contrast navigation.
- **Subtle Coral & Rose Accents** (`#E11D48`, `#F43F5E`): Celebratory warmth inspired by gulal, sindoor, and fresh roses.
- **Champagne Gold & Saffron Touches** (`#D97706`, `#FEF3C7`): Auspicious marigold and brass accents.
- **Fully Responsive & Accessible**: Optimized for mobile coordination and desktop planning with semantic HTML and keyboard accessibility.

---

## 🏗️ Technical Architecture

```
utsav-ai/
├── app/
│   ├── api/
│   │   ├── generate-plan/
│   │   │   └── route.ts         # Secure server-side Gemini 1.5 Flash route + Demo fallback
│   │   └── status/
│   │       └── route.ts         # Runtime configuration check (Live AI vs Demo Mode)
│   ├── globals.css              # Custom festive scrollbars and Tailwind directives
│   ├── layout.tsx               # Root layout, metadata, and viewport configuration
│   └── page.tsx                 # Reactive state orchestration & tab views
├── components/
│   ├── Navbar.tsx               # Brand header, event switcher dropdown, status pill
│   ├── EventHero.tsx            # Event title, countdown timer, city, guest & budget metrics
│   ├── NavigationTabs.tsx       # Six tab navigation with live badges & counters
│   ├── DashboardView.tsx        # High-level command center with KPI cards & quick actions
│   ├── AIPlanView.tsx           # Full AI blueprint (theme, culinary, rituals, vetting)
│   ├── BudgetView.tsx           # Interactive INR budget table with inline editing
│   ├── TimelineTasksView.tsx    # Checklist with filters & event-day Run of Show
│   ├── VendorsView.tsx          # Vendor directory with status pills & contact shortcuts
│   ├── SummaryInviteView.tsx    # Copyable WhatsApp & email templates + print dossier
│   └── CreateEventModal.tsx     # Validated event creation wizard with presets
├── lib/
│   ├── aiPlanner.ts             # Deterministic expert planning engine (Demo Mode)
│   ├── currencies.ts            # Indian Rupee (₹) formatting & countdown helpers
│   ├── sampleData.ts            # Pre-populated Jaipur royal wedding sample event
│   └── storage.ts               # Resilient localStorage persistence with fallback recovery
├── scripts/
│   └── test-engine.mjs          # Automated validation test suite
├── types/
│   └── index.ts                 # Strict TypeScript schemas for events, budget, tasks & vendors
├── .env.example                 # Clean environment variable placeholder
├── package.json                 # Lean dependencies (Next.js 14, React 18, Tailwind, Lucide)
├── tailwind.config.ts           # Custom festive color tokens & shadow system
└── tsconfig.json                # Strict TypeScript configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18.17.0` or higher (tested on Node v22)
- npm `v9+` or `v10+`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/utsav-ai.git
cd utsav-ai
npm install
```

### 2. Configure Environment (Optional)
Utsav AI is fully functional **without an API key** using its built-in Demo Engine. To enable live Google Gemini AI generation:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_actual_google_gemini_api_key
```
> Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the built-in test runner to verify currency formatting, date countdowns, and deterministic AI generation across all celebration types:

```bash
npm test
```

### Production Build Verification
Verify type checking and production bundle creation:
```bash
npm run build
```
*(Verified: compiles statically with 0 TypeScript or lint errors and 128 kB First Load JS).*

---

## 🔒 Security & Privacy

1. **Server-Only API Key**: `GEMINI_API_KEY` is accessed strictly inside the server-side Next.js route handler (`/api/generate-plan`). It is never exposed in client bundles or public API responses.
2. **Local Privacy**: User celebration data, guest lists, and quotes are stored locally in the user's browser via `localStorage`. No external database is needed.
3. **Repository Cleanliness**: The repository excludes `node_modules`, `.next`, cache files, and private `.env` files, ensuring total bundle weight remains well below competition limits.

---

## ☁️ Vercel Deployment Guide

Deploying Utsav AI on Vercel takes under 2 minutes:

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: Utsav AI - Celebration & Event Planner MVP"
   git branch -M main
   git remote add origin https://github.com/<your-username>/utsav-ai.git
   git push -u origin main
   ```
2. Navigate to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `utsav-ai` repository.
4. In the **Environment Variables** section:
   - Add `GEMINI_API_KEY` with your Google AI Studio API key (optional; if omitted, the app runs cleanly in Demo Mode).
5. Click **"Deploy"**.
6. Your live celebration planner will be accessible at `https://utsav-ai.vercel.app`!

---

## 🏆 PromptWars Evaluation Checklist

- [x] **Next.js App Router + TypeScript + Tailwind CSS**
- [x] **Server-side Route Handler for Gemini AI**
- [x] **Deterministic Demo Mode when no API key is provided**
- [x] **Event Creation with full validation (Name, Type, Date, City, Guests, Budget in INR, Dietary, Theme)**
- [x] **Personalized AI Blueprint (Theme, Decor, Culinary, Rituals, Budget Ratio, Tasks, Vendor Questions)**
- [x] **Budget Management in Indian Rupees (₹) with auto-recalculation & overspending alerts**
- [x] **Timeline & Checklist with priorities, phase filters, overdue notices & day-of Run of Show**
- [x] **Vendor Organizer with prospective vs confirmed statuses & click-to-contact links**
- [x] **Copyable WhatsApp and Email invitation messages**
- [x] **Pre-seeded Royal Jaipur Wedding sample celebration with instant sample reset**
- [x] **Lean footprint under 10 MB limit**

---

*Utsav AI — Celebrate Every Milestone with Perfection.*

