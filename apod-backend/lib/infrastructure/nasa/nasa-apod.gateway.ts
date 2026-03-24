import "server-only";

import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";
import type { ApodQuery } from "@/lib/domain/apod-query";
import type { NasaApodGatewayPort } from "@/lib/domain/ports/nasa-apod-gateway.port";

const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod";

type GatewayDeps = {
  apiKey: string;
  fetchImpl?: typeof fetch;
};

function appendMode(params: URLSearchParams, query: ApodQuery): void {
  const { mode } = query;
  if (mode.kind === "single") {
    if (mode.date) params.set("date", mode.date);
  } else if (mode.kind === "range") {
    params.set("start_date", mode.start_date);
    if (mode.end_date) params.set("end_date", mode.end_date);
  } else {
    params.set("count", String(mode.count));
  }
  if (query.thumbs) params.set("thumbs", "true");
}

/**
 * Infrastructure: NASA APOD HTTP client (implements domain port).
 */
export class NasaApodGateway implements NasaApodGatewayPort {
  constructor(private readonly deps: GatewayDeps) {}

  async fetchApod(query: ApodQuery): Promise<unknown> {
    const params = new URLSearchParams();
    params.set("api_key", this.deps.apiKey);
    appendMode(params, query);

    const url = `${NASA_APOD_URL}?${params.toString()}`;
    const fetchFn = this.deps.fetchImpl ?? fetch;
    const res = await fetchFn(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    const text = await res.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text };
    }

    if (!res.ok) {
      const msg =
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof (body as { error?: { message?: string } }).error?.message === "string"
          ? (body as { error: { message: string } }).error.message
          : res.statusText;
      throw new UpstreamHttpError(res.status, msg, body);
    }

    return body;
  }
}
