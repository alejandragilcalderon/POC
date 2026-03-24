import { ApiError } from "@/core/network/api-error";
import { InsightWeatherRepositoryImpl } from "@/modules/insight-weather/data/repositories/insight-weather-repository.impl";
import type { InsightWeatherRemoteDataSource } from "@/modules/insight-weather/data/datasources/insight-weather-remote.datasource";

describe("InsightWeatherRepositoryImpl", () => {
  it("returns payload on success", async () => {
    const remote: Pick<InsightWeatherRemoteDataSource, "fetchInsightWeather"> = {
      fetchInsightWeather: jest.fn().mockResolvedValue({ sol_keys: [] }),
    };
    const repo = new InsightWeatherRepositoryImpl(remote as InsightWeatherRemoteDataSource);

    const result = await repo.getInsightWeather();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ sol_keys: [] });
    }
  });

  it("maps ApiError to upstream failure", async () => {
    const remote: Pick<InsightWeatherRemoteDataSource, "fetchInsightWeather"> = {
      fetchInsightWeather: jest.fn().mockRejectedValue(new ApiError(500, "x", {})),
    };
    const repo = new InsightWeatherRepositoryImpl(remote as InsightWeatherRemoteDataSource);

    const result = await repo.getInsightWeather();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("upstream");
    }
  });

  it("maps invalid payload to network-style failure (mapper throws)", async () => {
    const remote: Pick<InsightWeatherRemoteDataSource, "fetchInsightWeather"> = {
      fetchInsightWeather: jest.fn().mockResolvedValue("not-an-object"),
    };
    const repo = new InsightWeatherRepositoryImpl(remote as InsightWeatherRemoteDataSource);

    const result = await repo.getInsightWeather();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("network");
      expect(result.error.message).toBe("Invalid insight weather response");
    }
  });
});
