import { InsightWeatherRemoteDataSource } from "@/modules/insight-weather/data/datasources/insight-weather-remote.datasource";

describe("InsightWeatherRemoteDataSource", () => {
  it("GETs JSON from /insight-weather", async () => {
    const getJson = jest.fn().mockResolvedValue({});
    const httpClient = { getJson };
    const ds = new InsightWeatherRemoteDataSource({
      httpClient,
      insightWeatherPath: "/insight-weather",
    });

    await ds.fetchInsightWeather();

    expect(getJson).toHaveBeenCalledWith("/insight-weather");
  });
});
