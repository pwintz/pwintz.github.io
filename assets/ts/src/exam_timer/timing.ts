// ╭───────────────────────────────────────────────────────────────╮
// │            Exam timer: the end time and time remaining        │
// ╰───────────────────────────────────────────────────────────────╯

export interface Extension { minutes: number; reason: string }

// The end of the exam: the scheduled end plus every extension.
export function endTime(scheduled: Date, extensions: Extension[]): Date {
  const minutes = extensions.reduce((sum, e) => sum + e.minutes, 0);
  return new Date(scheduled.getTime() + minutes * 60_000);
}

// The scheduled end on the day of `now`, from a time such as "10:25".
export function todayAt(time: string, now: Date): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(m[1]), Number(m[2]));
}

// Each number is kept on the same line as its unit (with a no-break space), so that the large
// display doesn't wrap between them.
// The time remaining, in whole minutes and without seconds (which distract students). Minutes
// are rounded up, so "5 min" means that more than 4 minutes are left, and the count never shows
// "0 min" while time remains.
export function remainingText(ms: number): string {
  if (ms <= 0) return "Time is up";
  const minutes = Math.ceil(ms / 60_000);
  if (minutes <= 1) return "Less than 1\u00a0minute";
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (!h) return `${min}\u00a0min`;
  return min ? `${h}\u00a0hr ${min}\u00a0min` : `${h}\u00a0hr`;
}

// A clock time without seconds, such as "10:25 am" (or "10:25" with a 24-hour clock).
export function clockText(d: Date, hour12: boolean): string {
  const min = String(d.getMinutes()).padStart(2, "0");
  if (!hour12) return `${String(d.getHours()).padStart(2, "0")}:${min}`;
  const h = d.getHours() % 12 || 12;
  return `${h}:${min} ${d.getHours() < 12 ? "am" : "pm"}`;
}
