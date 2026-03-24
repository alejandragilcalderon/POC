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
} as const;
