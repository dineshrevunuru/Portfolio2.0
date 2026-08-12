// Pacific-time date helpers for the widget, mirroring the app's datetime screen.
const TZ = 'America/Los_Angeles';
const DAY_ABBRS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const BOOKING_WINDOW_DAYS = 60;

export function laToday(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: TZ }).split(' ')[0];
}

export function fmtTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));
}

export function laHour(iso: string): number {
  const hh = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(new Date(iso));
  return parseInt(hh, 10);
}

export function fmtDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function startOfWeek(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  c.setDate(c.getDate() - c.getDay());
  return c;
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function maxDate(today: string): string {
  const [y, m, d] = today.split('-').map(Number);
  return toDateString(new Date(y, m - 1, d + BOOKING_WINDOW_DAYS));
}

export type WeekDay = { date: string; dayNum: number; abbr: string; selectable: boolean; isToday: boolean };

export function buildWeek(weekSunday: Date, today: string, max: string): WeekDay[] {
  return DAY_ABBRS.map((abbr, i) => {
    const d = addDays(weekSunday, i);
    const date = toDateString(d);
    return { date, dayNum: d.getDate(), abbr, selectable: date >= today && date <= max, isToday: date === today };
  });
}

export type CalDay = { date: string | null; dayNum: number | null; selectable: boolean; padding: boolean };

export function buildMonth(year: number, month: number, today: string, max: string): CalDay[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const weeks: CalDay[][] = [];
  let week: CalDay[] = [];
  for (let i = 0; i < first.getDay(); i++) week.push({ date: null, dayNum: null, selectable: false, padding: true });
  for (let d = 1; d <= last.getDate(); d++) {
    const date = toDateString(new Date(year, month, d));
    week.push({ date, dayNum: d, selectable: date >= today && date <= max, padding: false });
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push({ date: null, dayNum: null, selectable: false, padding: true }); weeks.push(week); }
  return weeks;
}

export const DAY_HEADERS = DAY_ABBRS;
export const MONTH_NAMES = MONTHS;
