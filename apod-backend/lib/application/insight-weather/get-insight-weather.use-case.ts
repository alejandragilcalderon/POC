import type { InsightWeatherGatewayPort } from "@/lib/domain/ports/insight-weather-gateway.port";

/**
 * Application: fetch InSight Mars Weather per-Sol summaries.
 */
export class GetInsightWeatherUseCase {
  constructor(private readonly gateway: InsightWeatherGatewayPort) {}

  execute(): Promise<unknown> {
    return this.gateway.fetchWeather();
  }
}
