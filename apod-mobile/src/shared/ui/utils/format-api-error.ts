import { strings } from "@/shared/resources";

/**
 * Human-readable copy for HTTP errors (avoid showing raw codes alone).
 */
export function friendlyHttpStatus(status: number): string {
  const map: Record<number, string> = {
    400: "The server couldn’t understand this request.",
    401: "You’re not signed in or your access key isn’t valid.",
    403: "You don’t have permission to open this.",
    404: "We couldn’t find that address. It may be mistyped in the app settings.",
    408: "The request took too long and was stopped.",
    429: "Too many requests right now. Please wait a bit and try again.",
    502: "The service is having trouble connecting upstream. It may be restarting.",
    503: "The service is temporarily unavailable. Try again shortly.",
    504: "The server took too long to answer.",
  };
  if (map[status]) return map[status];
  if (status >= 500) {
    return "Something went wrong on the server.";
  }
  if (status >= 400) {
    return "This request didn’t work. Check your connection or try again.";
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
    return `${base}\n\n${strings.errors.upstreamRetryHint} (Error ${status})`;
  }
  return `${base}\n\n${strings.errors.upstreamDetailsLabel}\n${trimmed}`;
}

export function friendlyNetworkMessage(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t || t === "Network request failed" || t === "Failed to fetch") {
    return strings.errors.networkBodyDefault;
  }
  return `We couldn’t finish loading. Here’s what we know:\n\n${t}`;
}
