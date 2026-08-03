export type AnalyticsEvent =
  | "copy"
  | "copy_all"
  | "download"
  | "share"
  | "favorite"
  | "compare"
  | "surprise"
  | "view";

/**
 * Fire-and-forget anonymous event tracking. Never blocks the UI and never
 * includes the typed text — only a style id and event type.
 */
export function track(event: AnalyticsEvent, styleId?: string, count?: number, appSlug?: string) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: event, styleId, count, appSlug }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let analytics break the app.
  }
}
