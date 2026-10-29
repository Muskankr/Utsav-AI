'use client';

import React from 'react';
import {
  Sparkles,
  Palette,
  Utensils,
  Music,
  HelpCircle,
  Check,
  RefreshCw,
  PieChart,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { FullEvent, AIEventPlan } from '@/types';
import { formatINR } from '@/lib/currencies';

interface AIPlanViewProps {
  event: FullEvent;
  onRegenerate: () => void;
  onApplyBudgetRatio: (ratio: Record<string, number>) => void;
  onImportSuggestedTasks: () => void;
  isAiLoading: boolean;
}

export function AIPlanView({
  event,
  onRegenerate,
  onApplyBudgetRatio,
  onImportSuggestedTasks,
  isAiLoading,
}: AIPlanViewProps) {
  const { details, plan } = event;
  const [appliedBudget, setAppliedBudget] = React.useState(false);
  const [importedTasks, setImportedTasks] = React.useState(false);

  if (!plan) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-ivory-300 shadow-soft">
        <Sparkles className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-indigo-950 mb-2">
          No AI Blueprint Generated Yet
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Synthesize a complete theme concept, catering menu, entertainment schedule, and budget breakdown for {details.name}.
        </p>
        <button
          onClick={onRegenerate}
          disabled={isAiLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAiLoading ? 'Synthesizing...' : 'Generate Blueprint with AI'}</span>
        </button>
      </div>
    );
  }

  const handleApplyBudget = () => {
    onApplyBudgetRatio(plan.recommendedBudgetRatio);
    setAppliedBudget(true);
    setTimeout(() => setAppliedBudget(false), 3000);
  };

  const handleImportTasks = () => {
    onImportSuggestedTasks();
    setImportedTasks(true);
    setTimeout(() => setImportedTasks(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* AI Header Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-elevated border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  plan.isAiGenerated
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {plan.isAiGenerated ? 'Gemini 1.5 Flash AI Blueprint' : 'Deterministic Expert Blueprint (Demo Mode)'}
              </span>
              <span className="text-xs text-slate-400">
                Generated: {new Date(plan.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Personalized Celebration Masterplan
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Model Engine: <span className="text-amber-300 font-mono text-xs">{plan.modelUsed}</span>.
              Calculated specifically for {details.guestCount} guests in {details.city || 'India'} with {details.dietary} cuisine rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleApplyBudget}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all active:scale-95"
            >
              {appliedBudget ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applied to Budget!</span>
                </>
              ) : (
                <>
                  <PieChart className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sync AI Budget</span>
                </>
              )}
            </button>

            <button
              onClick={handleImportTasks}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all active:scale-95"
            >
              {importedTasks ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Milestones Imported!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  <span>Import AI Tasks</span>
                </>
              )}
            </button>

            <button
              onClick={onRegenerate}
              disabled={isAiLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Recrafting...' : 'Re-craft'}</span>
            </button>
          </div>
        </div>

        {/* Summary Quote Banner */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm sm:text-base italic text-slate-200 leading-relaxed font-serif">
            "{plan.summary}"
          </p>
        </div>
      </div>

      {/* Grid: Theme & Aesthetics + Culinary Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Theme & Aesthetic Concepts */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-ivory-200">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                Theme & Floral Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Aesthetic direction & color harmony
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Primary Theme Vision
            </span>
            <p className="text-sm font-semibold text-rose-700">
              {plan.themeVision?.primaryTheme}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Curated Color Palette
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {plan.themeVision?.colorPalette?.map((hex, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-ivory-100 px-2.5 py-1 rounded-lg border border-ivory-200">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-xs font-mono text-slate-700 uppercase">
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Visual Mood & Ambiance
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-ivory-50 p-3 rounded-xl border border-ivory-200">
              {plan.themeVision?.aestheticVibe}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Signature Decor Installations
            </span>
            <div className="space-y-2">
              {plan.themeVision?.decorConcepts?.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-lg bg-ivory-100/60 border border-ivory-200"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Catering & Gourmet Menu */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-950">
                  Curated Culinary Experience
                </h3>
                <p className="text-xs text-slate-500">
                  Adapted for {details.dietary.replace('_', ' ').toUpperCase()} guests
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {details.guestCount} Pax
            </span>
          </div>

          {/* Welcome Drinks */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Signature Welcome Coolers
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.cateringHighlights?.welcomeDrinks?.map((drink, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 p-2 rounded-lg bg-ivory-50 border border-ivory-200 flex items-center gap-1.5"
                >
                  <span className="text-rose-500">🍸</span>
                  <span className="truncate">{drink}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Interactive Counters */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Live Interactive Food Stations
            </span>
            <div className="space-y-1.5">
              {plan.cateringHighlights?.liveCounters?.map((counter, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 flex items-center gap-1.5"
                >
                  <span className="text-amber-600 font-bold">🔥</span>
                  <span>{counter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Course Signature Dishes */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Signature Main Course Dishes
            </span>
            <div className="space-y-1.5">
              {plan.cateringHighlights?.specialties?.map((dish, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 p-2 rounded-lg bg-ivory-50 border border-ivory-200 flex items-center gap-1.5"
                >
                  <span className="text-emerald-600">🍲</span>
                  <span>{dish}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Celebratory Desserts */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Mithai & Dessert Bar
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.cateringHighlights?.desserts?.map((dessert, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-700 p-2 rounded-lg bg-rose-50/50 border border-rose-200/60 flex items-center gap-1.5"
                >
                  <span className="text-rose-500">🍨</span>
                  <span className="truncate">{dessert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Sacred Rituals & Entertainment + Recommended Budget Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Rituals & Entertainment Schedule */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-ivory-200">
            <div className="p-2 rounded-xl bg-festive-goldLight text-festive-gold">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                Rituals & Entertainment Milestones
              </h3>
              <p className="text-xs text-slate-500">
                Cultural traditions & interactive guest energy
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {plan.entertainmentRituals?.map((ritual, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-ivory-50 border border-ivory-200"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {ritual}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recommended Budget Distribution */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-indigo-950">
                  Recommended Budget Ratio
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated for total ₹{details.budget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <button
              onClick={handleApplyBudget}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Apply to Budget
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(plan.recommendedBudgetRatio || {}).map(([key, pct]) => {
              const estimatedInr = Math.round((details.budget * pct) / 100);
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize font-medium text-slate-700">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-indigo-950">
                      {formatINR(estimatedInr)}{' '}
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-festive-saffron to-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Crucial Vendor Vetting Checklist */}
      <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-ivory-200">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-indigo-950">
              Crucial Vendor Vetting Questions
            </h3>
            <p className="text-xs text-slate-500">
              Essential questions to ask Indian vendors before signing contracts or paying token deposits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.vendorRecommendations?.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-ivory-50/70 border border-ivory-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-indigo-950">
                  {rec.category}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  ~{rec.estimatedSharePercent}% budget share
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {rec.keyQuestions.map((q, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

