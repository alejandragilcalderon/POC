import "server-only";

import { GetApodUseCase } from "@/lib/application/apod/get-apod.use-case";
import { GetHealthUseCase } from "@/lib/application/health/get-health.use-case";
import { GetInsightWeatherUseCase } from "@/lib/application/insight-weather/get-insight-weather.use-case";
import { getNasaApodApiKey } from "@/lib/config/server-secrets";
import { NasaApodGateway } from "@/lib/infrastructure/nasa/nasa-apod.gateway";
import { NasaInsightWeatherGateway } from "@/lib/infrastructure/nasa/nasa-insight-weather.gateway";

export type AppContainer = {
  getApod: GetApodUseCase;
  getInsightWeather: GetInsightWeatherUseCase;
  getHealth: GetHealthUseCase;
};

/**
 * Composition root: wires infrastructure to application use cases (single place for DI).
 */
export function createAppContainer(): AppContainer {
  const apiKey = getNasaApodApiKey();
  const nasaApodGateway = new NasaApodGateway({ apiKey });
  const insightGateway = new NasaInsightWeatherGateway({ apiKey });

  return {
    getApod: new GetApodUseCase(nasaApodGateway),
    getInsightWeather: new GetInsightWeatherUseCase(insightGateway),
    getHealth: new GetHealthUseCase(),
  };
}
