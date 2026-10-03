export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseDateKey(key: string): { year: number; month: number; day: number } {
  const parts = key.split('-').map(Number);
  return {
    year: parts[0] || new Date().getFullYear(),
    month: (parts[1] || 1) - 1,
    day: parts[2] || 1,
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function calculateHoursFromTimes(bedtime: string, wakeTime: string): number {
  if (!bedtime || !wakeTime) return 0;
  const [bHours, bMinutes] = bedtime.split(':').map(Number);
  const [wHours, wMinutes] = wakeTime.split(':').map(Number);

  let bedMinutes = bHours * 60 + bMinutes;
  let wakeMinutes = wHours * 60 + wMinutes;

  if (wakeMinutes < bedMinutes) {
    // Crosses midnight
    wakeMinutes += 24 * 60;
  }

  const diffMinutes = wakeMinutes - bedMinutes;
  const hours = Math.round((diffMinutes / 60) * 10) / 10;
  return Math.min(24, Math.max(0, hours));
}

export function formatTimeDisplay(timeStr?: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
