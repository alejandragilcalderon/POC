import type { Result } from "@/core/types/result";
import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";

export type InsightWeatherFailure =
  | { kind: "network"; message: string }
  | { kind: "upstream"; status: number; message: string; details?: unknown };

export interface IInsightWeatherRepository {
  getInsightWeather(): Promise<Result<InsightWeatherPayload, InsightWeatherFailure>>;
}
