import { getApiBaseUrl } from "@/core/config/app-config";
import { HttpClientImpl } from "@/core/network/http-client.impl";
import { GetApodUseCase } from "@/modules/apod/application/get-apod.use-case";
import { ApodRemoteDataSource } from "@/modules/apod/data/datasources/apod-remote.datasource";
import { ApodRepositoryImpl } from "@/modules/apod/data/repositories/apod-repository.impl";
import { GetInsightWeatherUseCase } from "@/modules/insight-weather/application/get-insight-weather.use-case";
import { InsightWeatherRemoteDataSource } from "@/modules/insight-weather/data/datasources/insight-weather-remote.datasource";
import { InsightWeatherRepositoryImpl } from "@/modules/insight-weather/data/repositories/insight-weather-repository.impl";

export type AppDependencies = {
  getApodUseCase: GetApodUseCase;
  getInsightWeatherUseCase: GetInsightWeatherUseCase;
};

/**
 * Composition root: wires modules (Clean Architecture outer layer).
 */
export function createAppDependencies(): AppDependencies {
  const httpClient = new HttpClientImpl({ baseUrl: getApiBaseUrl() });
  const apodRemote = new ApodRemoteDataSource({
    httpClient,
    apodPath: "/apod",
  });
  const apodRepository = new ApodRepositoryImpl(apodRemote);

  const insightRemote = new InsightWeatherRemoteDataSource({
    httpClient,
    insightWeatherPath: "/insight-weather",
  });
  const insightRepository = new InsightWeatherRepositoryImpl(insightRemote);

  return {
    getApodUseCase: new GetApodUseCase(apodRepository),
    getInsightWeatherUseCase: new GetInsightWeatherUseCase(insightRepository),
  };
}
