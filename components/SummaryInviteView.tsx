'use client';

import React, { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  Printer,
  Mail,
  MessageSquare,
  FileText,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
} from 'lucide-react';
import { FullEvent } from '@/types';
import { formatINR, formatFriendlyDate } from '@/lib/currencies';

interface SummaryInviteViewProps {
  event: FullEvent;
}

export function SummaryInviteView({ event }: SummaryInviteViewProps) {
  const { details, plan, budgetItems, tasks, schedule, vendors } = event;
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const totalSpent = budgetItems.reduce((acc, i) => acc + (i.spent || 0), 0);
  const confirmedVendors = vendors.filter((v) => v.status === 'confirmed');
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Generate WhatsApp Invite Template
  const generateWhatsAppInvite = () => {
    return `🌸 *INVITATION: ${details.name.toUpperCase()}* 🌸

We warmly invite you and your family to join us in celebrating with love and joy!

🗓️ *Date:* ${formatFriendlyDate(details.date)}
📍 *Location / City:* ${details.city || 'India'}
✨ *Theme:* ${details.theme || 'Traditional Festive Celebrations'}
🍽️ *Culinary:* Special ${details.dietary.replace('_', ' ').toUpperCase()} Feast

${plan?.summary ? `"${plan.summary}"\n` : ''}
*Key Milestones of the Day:*
${schedule.slice(0, 4).map((s) => `• ${s.time} - ${s.title}`).join('\n')}

Kindly consider this as our personal invitation. We look forward to your gracious presence and blessings!

Warm Regards,
The Host Family
_RSVP: Please confirm your attendance with us._`;
  };

  // Generate Formal Email Template
  const generateEmailInvite = () => {
    return `Subject: Cordial Invitation: ${details.name} on ${formatFriendlyDate(details.date)}

Dear Family and Friends,

It brings us immense joy to invite you to celebrate "${details.name}" with us.

Event Details:
- Date: ${formatFriendlyDate(details.date)}
- Venue / City: ${details.city || 'India'}
- Theme: ${details.theme || 'Festive Indian Elegance'}
- Culinary Experience: Curated ${details.dietary.replace('_', ' ')} gourmet catering

Program Highlights:
${schedule.map((s) => `  * ${s.time}: ${s.title} (${s.description})`).join('\n')}

Your gracious presence and warm blessings will make this celebration truly complete and memorable for all of us.

With warm regards and respect,
The Host Family`;
  };

  // Generate Plain Text Executive Event Summary
  const generateFullSummaryText = () => {
    return `=====================================================
UTSAV AI — EXECUTIVE CELEBRATION MASTERPLAN SUMMARY
=====================================================

EVENT: ${details.name}
TYPE: ${details.type.toUpperCase()}
DATE: ${formatFriendlyDate(details.date)}
CITY: ${details.city}
GUEST COUNT: ${details.guestCount}
OVERALL BUDGET: ${formatINR(details.budget)}
TOTAL COMMITTED: ${formatINR(totalSpent)}

1. THEME & AMBIANCE:
- Primary Theme: ${plan?.themeVision.primaryTheme || details.theme}
- Visual Mood: ${plan?.themeVision.aestheticVibe || 'Traditional warmth'}

2. BUDGET STATUS:
- Venue: ${formatINR(budgetItems.find((b) => b.category === 'venue')?.spent || 0)}
- Catering: ${formatINR(budgetItems.find((b) => b.category === 'catering')?.spent || 0)}
- Decor: ${formatINR(budgetItems.find((b) => b.category === 'decoration')?.spent || 0)}
- Photography: ${formatINR(budgetItems.find((b) => b.category === 'photography')?.spent || 0)}
- Music & DJ: ${formatINR(budgetItems.find((b) => b.category === 'entertainment')?.spent || 0)}

3. TIMELINE & PROGRESS:
- Total Tasks: ${tasks.length} (${completedTasks} completed)
- Confirmed Vendors: ${confirmedVendors.length} of ${vendors.length}

4. KEY DAY-OF SCHEDULE:
${schedule.map((s) => `- ${s.time}: ${s.title} [${s.inCharge || 'Lead'}]`).join('\n')}

Generated with Utsav AI (Vedic Celebration Operating System)
=====================================================`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-indigo-950">
            Guest Invitations & Executive Summary
          </h2>
          <p className="text-xs text-slate-500">
            Copy-paste ready invitations for WhatsApp and Email, or export the full planning dossier.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-indigo-950 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => handleCopy(generateFullSummaryText(), 'full_summary')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold shadow-sm transition-all"
          >
            {copiedType === 'full_summary' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Summary Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-300" />
                <span>Copy Full Text Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two Column: WhatsApp Invite + Email Invite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Invite Card */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-indigo-950">
                  WhatsApp Invitation Card
                </h3>
                <p className="text-[11px] text-slate-500">
                  Formatted with WhatsApp bolding and celebratory emojis
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(generateWhatsAppInvite(), 'whatsapp')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              {copiedType === 'whatsapp' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy for WhatsApp</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {generateWhatsAppInvite()}
          </pre>
        </div>

        {/* Email Formal Invite Card */}
        <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-indigo-950">
                  Formal Email Invitation
                </h3>
                <p className="text-[11px] text-slate-500">
                  Polite, refined text suitable for outstation relatives & VIP guests
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(generateEmailInvite(), 'email')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-semibold transition-colors"
            >
              {copiedType === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {generateEmailInvite()}
          </pre>
        </div>
      </div>

      {/* Printable Executive Dossier Preview */}
      <div className="bg-white rounded-2xl border border-ivory-300 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="border-b border-ivory-300 pb-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
              Executive Dossier
            </span>
            <h2 className="font-serif text-2xl font-bold text-indigo-950 mt-2">
              {details.name}
            </h2>
            <p className="text-xs text-slate-500">
              {details.city || 'India'} • {formatFriendlyDate(details.date)} • {details.guestCount} Guests
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Budget Allocation</span>
            <span className="font-serif text-2xl font-bold text-indigo-950">
              {formatINR(details.budget)}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">
              Committed: {formatINR(totalSpent)}
            </span>
          </div>
        </div>

        {/* 3 Columns summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div>
            <h4 className="font-semibold text-indigo-950 uppercase tracking-wider text-[11px] mb-2 border-b border-ivory-200 pb-1">
              Celebration Vision & Theme
            </h4>
            <p className="font-medium text-rose-700 mb-1">{plan?.themeVision?.primaryTheme || details.theme}</p>
            <p className="text-slate-600 leading-relaxed mb-3">{plan?.themeVision?.aestheticVibe || 'Traditional hospitality'}</p>
            <div className="space-y-1">
              <p><strong>Dietary:</strong> {details.dietary.replace('_', ' ')}</p>
              <p><strong>Special Notes:</strong> {details.preferences || 'Standard arrangements'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-indigo-950 uppercase tracking-wider text-[11px] mb-2 border-b border-ivory-200 pb-1">
              Key Vendors Status ({confirmedVendors.length} Confirmed)
            </h4>
            <div className="space-y-2">
              {vendors.slice(0, 5).map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <span className="truncate max-w-[140px] font-medium">{v.name} ({v.category})</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    v.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-ivory-200 text-slate-600'
                  }`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-indigo-950 uppercase tracking-wider text-[11px] mb-2 border-b border-ivory-200 pb-1">
              Top Checklist Milestones
            </h4>
            <div className="space-y-1.5">
              {tasks.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-start gap-1.5">
                  <span className={t.completed ? 'text-emerald-600' : 'text-slate-400'}>
                    {t.completed ? '✓' : '○'}
                  </span>
                  <span className={`truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

