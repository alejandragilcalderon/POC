/**
 * Human-readable copy for HTTP errors (avoid showing raw codes alone).
 */
export function friendlyHttpStatus(status: number): string {
  const map: Record<number, string> = {
    400: "The server couldn’t understand this request.",
    401: "You’re not allowed to access this. Check sign-in or API keys.",
    403: "Access to this resource was denied.",
    404: "We couldn’t find that endpoint. Check your API base URL.",
    408: "The request took too long.",
    429: "Too many requests. Wait a moment and try again.",
    502: "Bad gateway — the backend may be restarting.",
    503: "Service unavailable — try again shortly.",
    504: "Gateway timeout — the server took too long to respond.",
  };
  if (map[status]) return map[status];
  if (status >= 500) {
    return "The server had a problem. Please try again in a moment.";
  }
  if (status >= 400) {
    return "The request didn’t succeed. Check your connection and settings.";
  }
  return "Something unexpected happened.";
}

const GENERIC_SERVER = new Set([
  "Internal Server Error",
  "Bad Gateway",
  "Service Unavailable",
  "Gateway Timeout",
  "",
]);

export function formatUpstreamMessage(status: number, serverMessage: string): string {
  const base = friendlyHttpStatus(status);
  const trimmed = serverMessage?.trim() ?? "";
  if (!trimmed || GENERIC_SERVER.has(trimmed)) {
    return `${base} (code ${status})`;
  }
  return `${base}\n\nDetails: ${trimmed}`;
}

export function friendlyNetworkMessage(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t || t === "Network request failed" || t === "Failed to fetch") {
    return "We couldn’t reach your API. Check Wi‑Fi, that the backend is running, and that EXPO_PUBLIC_API_BASE_URL is correct (use your computer’s IP for a physical device).";
  }
  return `Connection problem: ${t}`;
}
