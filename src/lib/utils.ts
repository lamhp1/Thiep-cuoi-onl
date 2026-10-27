export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatVietnameseDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      return `Ngày ${day} Tháng ${month}, ${year}`;
    }
    const d = new Date(dateStr);
    return `Ngày ${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
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
  const target = new Date(targetDateIso).getTime();
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
  // Format: 20261220T100000 / 20261220T130000
  const cleanDate = date.replace(/[^0-9]/g, '');
  const cleanTime = time.replace(/[^0-9]/g, '');
  const startParam = `20261220T${cleanTime || '100000'}`;
  const endParam = `20261220T140000`;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startParam}/${endParam}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
