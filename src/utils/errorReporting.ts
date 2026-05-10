/**
 * Centralised error reporting.
 * In development: logs to console.
 * In production: plug in Sentry, Bugsnag, or similar here.
 */

type ErrorContext = Record<string, unknown>;

export function reportError(error: unknown, context?: ErrorContext): void {
  if (__DEV__) {
    console.error("[FitCoach Error]", error, context);
    return;
  }

  // Production: send to Sentry
  // Sentry.captureException(error, { extra: context });
}

export function reportMessage(message: string, context?: ErrorContext): void {
  if (__DEV__) {
    console.warn("[FitCoach]", message, context);
    return;
  }

  // Production: send to Sentry
  // Sentry.captureMessage(message, { extra: context });
}

/**
 * Wraps an async function and reports errors without crashing.
 * Returns null on failure.
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context?: ErrorContext
): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    reportError(err, context);
    return null;
  }
}
