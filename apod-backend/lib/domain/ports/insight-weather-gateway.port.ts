/**
 * Outbound port: NASA InSight Mars Weather HTTP API.
 */
export interface InsightWeatherGatewayPort {
  fetchWeather(): Promise<unknown>;
}
