import { ApiError } from "@/core/network/api-error";
import { ok, fail, type Result } from "@/core/types/result";
import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";
import type {
  InsightWeatherFailure,
  IInsightWeatherRepository,
} from "@/modules/insight-weather/domain/ports/insight-weather-repository.port";
import { InsightWeatherMapper } from "@/modules/insight-weather/data/mappers/insight-weather.mapper";
import type { InsightWeatherRemoteDataSource } from "@/modules/insight-weather/data/datasources/insight-weather-remote.datasource";

export class InsightWeatherRepositoryImpl implements IInsightWeatherRepository {
  constructor(private readonly remote: InsightWeatherRemoteDataSource) {}

  async getInsightWeather(): Promise<Result<InsightWeatherPayload, InsightWeatherFailure>> {
    try {
      const raw = await this.remote.fetchInsightWeather();
      const value = InsightWeatherMapper.fromDto(raw);
      return ok(value);
    } catch (e) {
      if (e instanceof ApiError) {
        return fail({
          kind: "upstream",
          status: e.statusCode,
          message: e.message,
          details: e.body,
        });
      }
      const message = e instanceof Error ? e.message : "Request failed";
      return fail({ kind: "network", message });
    }
  }
}
