/**
 * Currency and Indian numbering utilities
 */

/**
 * Format a number as Indian Rupee (INR) currency string
 * e.g. 1500000 -> ₹15,00,000
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  
  // Format with Indian locale
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(absVal);
    return `${isNegative ? '-' : ''}₹${formatted}`;
  } catch {
    return `${isNegative ? '-' : ''}₹${absVal.toLocaleString()}`;
  }
}

/**
 * Format compact Indian amount (Lakh / Crore)
 * e.g. 1500000 -> "₹15 Lakh", 25000000 -> "₹2.5 Cr"
 */
export function formatINRCompact(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = (abs / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${sign}₹${cr} Cr`;
  }
  if (abs >= 100000) {
    const lk = (abs / 100000).toFixed(2).replace(/\.00$/, '');
    return `${sign}₹${lk} Lakh`;
  }
  if (abs >= 1000) {
    const k = (abs / 1000).toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${k}k`;
  }
  return formatINR(amount);
}

/**
 * Calculate days remaining or past
 */
export function getDaysRemaining(targetDateStr: string): {
  days: number;
  isPast: boolean;
  isToday: boolean;
  label: string;
} {
  if (!targetDateStr) {
    return { days: 0, isPast: false, isToday: false, label: 'Date not set' };
  }

  const target = new Date(targetDateStr);
  const now = new Date();
  
  // Strip time parts for calendar day comparison
  const dTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = dTarget.getTime() - dNow.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, isPast: false, isToday: true, label: 'Happening Today!' };
  } else if (diffDays > 0) {
    return {
      days: diffDays,
      isPast: false,
      isToday: false,
      label: diffDays === 1 ? 'Tomorrow' : `${diffDays} days to go`,
    };
  } else {
    const past = Math.abs(diffDays);
    return {
      days: diffDays,
      isPast: true,
      isToday: false,
      label: past === 1 ? '1 day ago' : `${past} days ago`,
    };
  }
}

/**
 * Friendly date formatter e.g. "Sun, 15 Nov 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return 'Not scheduled';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

