'use client';

import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Users, IndianRupee, Utensils, Heart } from 'lucide-react';
import { EventType, DietaryRequirement, EventDetails } from '@/types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>, autoGenerateAi: boolean) => void;
}

const INDIAN_CITIES = [
  'Jaipur',
  'Udaipur',
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Goa',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Chennai',
  'Varanasi',
];

const BUDGET_PRESETS = [
  { label: '₹2 Lakh', value: 200000 },
  { label: '₹5 Lakh', value: 500000 },
  { label: '₹10 Lakh', value: 1000000 },
  { label: '₹18 Lakh', value: 1800000 },
  { label: '₹35 Lakh', value: 3500000 },
  { label: '₹50 Lakh+', value: 5000000 },
];

export function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<EventType>('wedding');
  const [date, setDate] = useState(() => {
    // Default to 45 days in future
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [city, setCity] = useState('Jaipur');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [budget, setBudget] = useState<number>(1200000);
  const [theme, setTheme] = useState('Royal Heritage & Marigold Warmth');
  const [dietary, setDietary] = useState<DietaryRequirement>('multi_cuisine');
  const [preferences, setPreferences] = useState('');
  const [autoGenerateAi, setAutoGenerateAi] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a memorable celebration name.');
      return;
    }
    if (!date) {
      setError('Please choose a valid celebration date.');
      return;
    }
    if (guestCount <= 0) {
      setError('Guest count must be at least 1 person.');
      return;
    }
    if (budget <= 0) {
      setError('Please enter a budget in INR.');
      return;
    }

    setError(null);
    onSubmit(
      {
        name: name.trim(),
        type,
        date,
        city: city.trim(),
        guestCount,
        budget,
        theme: theme.trim(),
        dietary,
        preferences: preferences.trim(),
      },
      autoGenerateAi
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-elevated border border-ivory-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight">
                Plan a New Celebration
              </h2>
              <p className="text-xs text-slate-300">
                Utsav AI customizes themes, budgets, menus, and timelines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Event Type Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Celebration Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'wedding', label: 'Wedding / Vivah' },
                { id: 'birthday', label: 'Birthday / Jubilee' },
                { id: 'community', label: 'Community Festival' },
                { id: 'anniversary', label: 'Anniversary Gala' },
                { id: 'pooja_ceremony', label: 'Pooja / Griha Pravesh' },
                { id: 'corporate_gala', label: 'Corporate Gala' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setType(cat.id as EventType)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    type === cat.id
                      ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold shadow-sm ring-1 ring-rose-500'
                      : 'border-ivory-300 bg-ivory-50 text-slate-700 hover:bg-ivory-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Celebration Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav & Meera's Royal Wedding, Rohan's 30th Birthday Bash"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
            />
          </div>

          {/* Date & City Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Celebration Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                City / Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jaipur, Rajasthan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {INDIAN_CITIES.slice(0, 6).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCity(c)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guest Count & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Expected Guests <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[50, 150, 300, 500, 800].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Overall Budget (INR ₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="10000"
                step="10000"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {BUDGET_PRESETS.map((bp) => (
                  <button
                    type="button"
                    key={bp.label}
                    onClick={() => setBudget(bp.value)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    {bp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dietary Requirements */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Dietary & Culinary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pure_veg', label: 'Pure Veg (Shakahari)' },
                { id: 'jain_options', label: 'Jain Dedicated Line' },
                { id: 'multi_cuisine', label: 'Multi-Cuisine Grand' },
                { id: 'regional_specialty', label: 'Regional Specialties' },
              ].map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDietary(d.id as DietaryRequirement)}
                  className={`px-2.5 py-2 rounded-xl text-xs border text-center transition-all ${
                    dietary === d.id
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-500'
                      : 'border-ivory-300 bg-ivory-50 text-slate-700 hover:bg-ivory-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme & Custom Preferences */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Aesthetic Theme or Vibe
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Rajputana, Boho Pastel, Bollywood Glam, Vedic Sacred"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Special Requests & Host Preferences
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Sunset pheras, live chaat counter, Manganiyar welcome musicians, eco-friendly seed-paper favors, late-night tea stall."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-ivory-300 bg-ivory-50/50 text-indigo-950 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Auto AI Generate checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory-100 border border-ivory-200">
            <input
              type="checkbox"
              id="autoAi"
              checked={autoGenerateAi}
              onChange={(e) => setAutoGenerateAi(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded border-ivory-400 focus:ring-rose-500"
            />
            <label htmlFor="autoAi" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-semibold text-indigo-950">
                Immediately synthesize personalized AI Blueprint
              </span>
              <p className="text-slate-500">
                Generates theme decor, culinary menu, budget breakdown, and timeline milestones.
              </p>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ivory-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-ivory-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Celebration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

