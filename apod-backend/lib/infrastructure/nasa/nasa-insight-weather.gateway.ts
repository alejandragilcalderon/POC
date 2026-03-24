import "server-only";

import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";
import type { InsightWeatherGatewayPort } from "@/lib/domain/ports/insight-weather-gateway.port";

const NASA_INSIGHT_WEATHER_URL = "https://api.nasa.gov/insight_weather/";

type GatewayDeps = {
  apiKey: string;
  fetchImpl?: typeof fetch;
};

/**
 * Infrastructure: NASA InSight Mars Weather HTTP client.
 */
export class NasaInsightWeatherGateway implements InsightWeatherGatewayPort {
  constructor(private readonly deps: GatewayDeps) {}

  async fetchWeather(): Promise<unknown> {
    const params = new URLSearchParams();
    params.set("api_key", this.deps.apiKey);
    params.set("feedtype", "json");
    params.set("ver", "1.0");

    const url = `${NASA_INSIGHT_WEATHER_URL}?${params.toString()}`;
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
