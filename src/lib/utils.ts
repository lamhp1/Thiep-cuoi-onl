export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function parseFlexibleDate(dateStr: string, defaultTime: string = '10:00:00'): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Handle ISO datetime e.g. 2026-12-20T10:00:00
  if (trimmed.includes('T')) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  // Handle YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    const [hh = '10', mm = '00', ss = '00'] = defaultTime.split(':');
    const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Handle DD/MM/YYYY or DD.MM.YYYY or DD-MM-YYYY (including "20 • 12 • 2026")
  const dmyMatch = trimmed.match(/^(\d{1,2})(?:\s*[-/.•]\s*)(\d{1,2})(?:\s*[-/.•]\s*)(\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const [hh = '10', mm = '00', ss = '00'] = defaultTime.split(':');
    const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
    if (!isNaN(parsed.getTime())) return parsed;
  }

  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function formatVietnameseDate(dateStr: string): string {
  try {
    if (!dateStr) return '';
    const d = parseFlexibleDate(dateStr);
    if (d && !isNaN(d.getTime())) {
      return `Ngày ${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function calculateCountdown(targetDateIso: string): CountdownResult {
  const parsed = parseFlexibleDate(targetDateIso, '10:00:00');
  const target = parsed ? parsed.getTime() : NaN;
  const now = new Date().getTime();
  const diff = target - now;

  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.warn('Copy failed', err);
    return false;
  }
}

export function createGoogleCalendarUrl(title: string, date: string, time: string, location: string, details: string): string {
  const parsedDate = parseFlexibleDate(date, time || '10:00:00');
  let ymd = '20261220';
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    const y = parsedDate.getFullYear();
    const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const d = String(parsedDate.getDate()).padStart(2, '0');
    ymd = `${y}${m}${d}`;
  } else {
    const digits = (date || '').replace(/[^0-9]/g, '');
    if (digits.length === 8) {
      ymd = digits;
    }
  }

  const timeDigits = (time || '10:00').replace(/[^0-9]/g, '');
  const startH = timeDigits.length >= 2 ? parseInt(timeDigits.slice(0, 2), 10) : 10;
  const startM = timeDigits.length >= 4 ? timeDigits.slice(2, 4) : '00';
  const startS = timeDigits.length >= 6 ? timeDigits.slice(4, 6) : '00';
  const safeStartH = isNaN(startH) ? 10 : Math.min(23, Math.max(0, startH));
  const endH = Math.min(23, safeStartH + 3);

  const startParam = `${ymd}T${String(safeStartH).padStart(2, '0')}${startM}${startS}`;
  const endParam = `${ymd}T${String(endH).padStart(2, '0')}${startM}${startS}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startParam}/${endParam}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
