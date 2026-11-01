
/**
 * Currency and Indian numbering utilities for Utsav AI.
 */

/**
 * Safely checks whether a value is a valid finite number.
 */
function isValidNumber(amount: number): boolean {
  return typeof amount === 'number' && Number.isFinite(amount);
}

/**
 * Removes unnecessary trailing decimal zeroes.
 * Examples: 2.50 -> 2.5, 15.00 -> 15
 */
function trimDecimalZeros(value: number, digits: number): string {
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

/**
 * Format a number as Indian Rupee (INR).
 * Example: 1500000 -> ₹15,00,000
 */
export function formatINR(amount: number): string {
  if (!isValidNumber(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(absVal);

    return `${isNegative ? '-' : ''}₹${formatted}`;
  } catch {
    return `${isNegative ? '-' : ''}₹${absVal.toLocaleString('en-IN')}`;
  }
}

/**
 * Format compact Indian currency.
 * Examples:
 * 1500     -> ₹1.5k
 * 150000   -> ₹1.5 Lakh
 * 1500000  -> ₹15 Lakh
 * 25000000 -> ₹2.5 Cr
 */
export function formatINRCompact(amount: number): string {
  if (!isValidNumber(amount) || amount === 0) {
    return '₹0';
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = trimDecimalZeros(abs / 10000000, 2);
    return `${sign}₹${cr} Cr`;
  }

  if (abs >= 100000) {
    const lakh = trimDecimalZeros(abs / 100000, 2);
    return `${sign}₹${lakh} Lakh`;
  }

  if (abs >= 1000) {
    const thousand = trimDecimalZeros(abs / 1000, 1);
    return `${sign}₹${thousand}k`;
  }

  return formatINR(amount);
}

/**
 * Parse a date string as a local calendar date.
 * Handles YYYY-MM-DD without UTC timezone shifting.
 */
function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }

  const trimmed = dateStr.trim();

  // Parse date-only strings using local calendar components.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);

    const date = new Date(year, month - 1, day);

    // Reject impossible dates such as 2026-02-30.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

/**
 * Calculate days remaining or past for an event.
 */
export function getDaysRemaining(targetDateStr: string): {
  days: number;
  isPast: boolean;
  isToday: boolean;
  label: string;
} {
  const target = parseLocalDate(targetDateStr);

  if (!target) {
    return {
      days: 0,
      isPast: false,
      isToday: false,
      label: 'Date not set',
    };
  }

  const now = new Date();

  // Compare calendar dates, ignoring time.
  const targetDay = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const currentDay = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffDays = Math.round(
    (targetDay - currentDay) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return {
      days: 0,
      isPast: false,
      isToday: true,
      label: 'Happening Today!',
    };
  }

  if (diffDays > 0) {
    return {
      days: diffDays,
      isPast: false,
      isToday: false,
      label: diffDays === 1 ? 'Tomorrow' : `${diffDays} days to go`,
    };
  }

  const past = Math.abs(diffDays);

  return {
    days: diffDays,
    isPast: true,
    isToday: false,
    label: past === 1 ? '1 day ago' : `${past} days ago`,
  };
}

/**
 * Friendly date formatter.
 * Example: Sun, 15 Nov 2026
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return 'Not scheduled';
  }

  const date = parseLocalDate(dateStr);

  if (!date) {
    return 'Not scheduled';
  }

  try {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Not scheduled';
  }
}
