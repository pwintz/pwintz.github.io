// ╭───────────────────────────────────────────────────────────────╮
// │              Saved settings (this browser only)               │
// ╰───────────────────────────────────────────────────────────────╯
// All of the tools save their settings through these functions rather than using localStorage
// directly. Storage can be unavailable (private windows, blocked site data) or full, so every
// function fails quietly: loads return null, and saves are skipped. The pages work without it.

export function loadString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch { /* Not saved */ }
}

// Returns null if nothing is saved or the saved text isn't valid JSON. The result isn't checked
// against T, so callers should validate data saved by older versions of their page.
export function loadJSON<T = unknown>(key: string): T | null {
  const raw = loadString(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJSON(key: string, value: unknown): void {
  saveString(key, JSON.stringify(value));
}

export function removeSaved(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch { /* Nothing to remove */ }
}
