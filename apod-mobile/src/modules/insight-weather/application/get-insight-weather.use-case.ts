import type { Result } from "@/core/types/result";
import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";
import type {
  InsightWeatherFailure,
  IInsightWeatherRepository,
} from "@/modules/insight-weather/domain/ports/insight-weather-repository.port";

export class GetInsightWeatherUseCase {
  constructor(private readonly repo: IInsightWeatherRepository) {}

  execute(): Promise<Result<InsightWeatherPayload, InsightWeatherFailure>> {
    return this.repo.getInsightWeather();
  }
}
