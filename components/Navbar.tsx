'use client';

import React from 'react';
import { Sparkles, Calendar, Plus, RotateCcw, ChevronDown, Check, Info } from 'lucide-react';
import { FullEvent } from '@/types';

interface NavbarProps {
  events: FullEvent[];
  activeEvent: FullEvent;
  onSelectEvent: (id: string) => void;
  onOpenCreateModal: () => void;
  onResetSample: () => void;
  hasGeminiKey: boolean;
}

export function Navbar({
  events,
  activeEvent,
  onSelectEvent,
  onOpenCreateModal,
  onResetSample,
  hasGeminiKey,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ivory-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-festive-saffron to-festive-gold flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-indigo-950">
                Utsav <span className="text-rose-600">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                Celebration OS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              AI Event & Wedding Planner for India
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Event Dropdown Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 text-indigo-950 transition-colors max-w-[200px] sm:max-w-xs truncate"
              title="Switch Event"
            >
              <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{activeEvent.details.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-card border border-ivory-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-ivory-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Saved Celebrations ({events.length})
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {events.map((evt) => {
                    const isSelected = evt.details.id === activeEvent.details.id;
                    return (
                      <button
                        key={evt.details.id}
                        onClick={() => {
                          onSelectEvent(evt.details.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 hover:bg-ivory-100 transition-colors ${
                          isSelected ? 'bg-amber-50/80 text-amber-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate font-medium">{evt.details.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {evt.details.city || 'India'} • {evt.details.type}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-ivory-200 pt-1 mt-1 px-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenCreateModal();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Another Event
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Engine Status Pill */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              hasGeminiKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={
              hasGeminiKey
                ? 'Gemini API is configured on server.'
                : 'Demo Mode: Running with Utsav AI deterministic expert engine. Configure GEMINI_API_KEY in .env to enable live AI.'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasGeminiKey ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              }`}
            />
            <span>{hasGeminiKey ? 'Gemini 1.5 Flash' : 'Demo Engine'}</span>
          </div>

          {/* Create Event Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Event</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Reset to Sample Button */}
          <button
            onClick={onResetSample}
            title="Restore default sample event"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-ivory-200 border border-ivory-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

