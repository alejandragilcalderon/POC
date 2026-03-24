/**
 * User-visible copy grouped by feature. Add new namespaces as screens grow.
 */
export const strings = {
  apod: {
    homeTitle: "Today's astronomy",
    homeSubtitle: "NASA's Astronomy Picture of the Day",
  },
  insightWeather: {
    screenTitle: "InSight Mars weather",
    screenSubtitle: "NASA InSight lander weather summaries.",
    widgetHint: "Per-Sol summaries",
    emptyTitle: "No Sol data in this response",
    emptyBody:
      "The API may have returned only metadata (for example validity checks) or an empty archive.",
  },
  errors: {
    /** Shared title when the device cannot reach the backend */
    networkTitle: "You’re offline or we can’t connect",
    /** Default body when fetch fails (no extra detail from the system) */
    networkBodyDefault: `We couldn’t reach the service. Try:

• Turning Wi‑Fi or cellular data on
• Making sure the computer that hosts the API is running (if you’re testing locally)
• Using the same Wi‑Fi as that computer when you’re on a real phone`,

    unauthorizedTitle: "We couldn’t verify access",
    unauthorizedBody:
      "This request needs permission. If you use sign-in or an API key, try again or ask your team for access.",

    apodUpstreamTitle: "We couldn’t load today’s picture",
    insightUpstreamTitle: "We couldn’t load Mars weather",

    /** Appended after the main explanation for HTTP errors without a helpful server message */
    upstreamRetryHint: "If this keeps happening, wait a moment and try again.",
    /** Label before the raw server message when it may help debugging */
    upstreamDetailsLabel: "More detail:",
  },
} as const;
