'use client';

import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Sparkles,
  Trash2,
  Clock,
  Heart,
  Cake,
  Flame,
  Award,
} from 'lucide-react';
import { FullEvent, EventType } from '@/types';
import { formatINR, getDaysRemaining, formatFriendlyDate } from '@/lib/currencies';

interface EventHeroProps {
  event: FullEvent;
  onRegenerateAI: () => void;
  onDeleteEvent: () => void;
  isAiLoading: boolean;
}

export function EventHero({
  event,
  onRegenerateAI,
  onDeleteEvent,
  isAiLoading,
}: EventHeroProps) {
  const { details, plan } = event;
  const countdown = getDaysRemaining(details.date);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'wedding':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'birthday':
        return <Cake className="w-4 h-4 text-amber-500" />;
      case 'pooja_ceremony':
        return <Flame className="w-4 h-4 text-orange-500" />;
      default:
        return <Award className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case 'wedding':
        return 'Royal Wedding';
      case 'birthday':
        return 'Birthday Jubilee';
      case 'community':
        return 'Community Festival';
      case 'anniversary':
        return 'Anniversary Gala';
      case 'pooja_ceremony':
        return 'Vedic Pooja & Havan';
      case 'corporate_gala':
        return 'Corporate Gala';
      default:
        return 'Celebration';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-elevated border border-indigo-800/40 p-6 sm:p-8">
      {/* Decorative background glow & traditional motifs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Event Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15">
              {getEventIcon(details.type)}
              {getEventTypeLabel(details.type)}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                countdown.isPast
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : countdown.isToday
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                  : 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {countdown.label}
            </span>

            {plan?.isAiGenerated ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Gemini Live AI Plan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Expert Plan
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            {details.name}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2">
            {details.theme ? `${details.theme} • ` : ''}
            {details.preferences || 'Personalized celebration crafted with Indian hospitality.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formatFriendlyDate(details.date)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{details.city || 'India'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{details.guestCount} Guests</span>
            </div>

            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-festive-saffron shrink-0" />
              <span className="font-semibold text-white">
                {formatINR(details.budget)} Budget
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
          <button
            onClick={onRegenerateAI}
            disabled={isAiLoading}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-festive-saffron hover:from-rose-500 hover:to-festive-saffron/90 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Curating Plan...' : 'Re-craft AI Plan'}</span>
          </button>

          <button
            onClick={onDeleteEvent}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            title="Delete this event"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}

