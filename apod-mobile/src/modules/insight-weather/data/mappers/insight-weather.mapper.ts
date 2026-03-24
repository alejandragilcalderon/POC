import type { InsightWeatherPayload } from "@/modules/insight-weather/domain/entities/insight-weather-payload";

export class InsightWeatherMapper {
  static fromDto(raw: unknown): InsightWeatherPayload {
    if (typeof raw !== "object" || raw === null) {
      throw new Error("Invalid insight weather response");
    }
    return raw as InsightWeatherPayload;
  }
}
