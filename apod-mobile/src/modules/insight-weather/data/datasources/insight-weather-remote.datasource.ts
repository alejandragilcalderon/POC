import type { IHttpClient } from "@/core/network/http-client.interface";

type Deps = {
  httpClient: IHttpClient;
  /** e.g. "/insight-weather" when base URL includes `/api` */
  insightWeatherPath: string;
};

/**
 * GET /api/insight-weather — InSight Mars Weather via apod-backend.
 */
export class InsightWeatherRemoteDataSource {
  constructor(private readonly deps: Deps) {}

  async fetchInsightWeather(): Promise<unknown> {
    return this.deps.httpClient.getJson<unknown>(this.deps.insightWeatherPath);
  }
}
