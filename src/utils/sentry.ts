import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export const isSentryConfigured = Boolean(SENTRY_DSN);

// Sin DSN configurado (desarrollo local, o antes de tener la cuenta lista)
// esto no hace nada — la app funciona exactamente igual.
export function initSentry() {
  if (!isSentryConfigured) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
  });
}

export { Sentry };
