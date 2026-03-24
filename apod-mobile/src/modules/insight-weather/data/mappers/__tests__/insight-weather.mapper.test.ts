import { InsightWeatherMapper } from "@/modules/insight-weather/data/mappers/insight-weather.mapper";

describe("InsightWeatherMapper", () => {
  it("maps object responses", () => {
    const out = InsightWeatherMapper.fromDto({ sol_keys: ["1000"] });
    expect(out).toEqual({ sol_keys: ["1000"] });
  });

  it("rejects non-objects", () => {
    expect(() => InsightWeatherMapper.fromDto(null)).toThrow("Invalid insight weather response");
  });
});
