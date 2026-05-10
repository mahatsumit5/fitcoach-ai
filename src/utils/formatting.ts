/**
 * Shared formatting utilities used across the app.
 */

/** Format a number as kg with 1 decimal place */
export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

/** Format seconds into mm:ss */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Format seconds into a human-readable string e.g. "1h 23m" */
export function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Capitalise the first letter of a string */
export function capitalise(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Convert snake_case to Title Case */
export function snakeToTitle(str: string): string {
  return str.split("_").map(capitalise).join(" ");
}

/** Format a date string to "Mon, 10 May" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day:     "numeric",
    month:   "long",
  });
}

/** Format a date string to time only e.g. "9:41 AM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour:   "numeric",
    minute: "2-digit",
  });
}

/** Return a relative time string e.g. "2 days ago" */
export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60)  return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Round to N decimal places */
export function round(value: number, decimals = 1): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
