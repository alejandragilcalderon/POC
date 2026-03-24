import { GetInsightWeatherUseCase } from "@/modules/insight-weather/application/get-insight-weather.use-case";
import type { IInsightWeatherRepository } from "@/modules/insight-weather/domain/ports/insight-weather-repository.port";

describe("GetInsightWeatherUseCase", () => {
  it("delegates to repository", async () => {
    const getInsightWeather = jest.fn().mockResolvedValue({
      ok: true,
      value: { sol_keys: [] },
    });

    const repo: IInsightWeatherRepository = { getInsightWeather };
    const uc = new GetInsightWeatherUseCase(repo);

    const result = await uc.execute();

    expect(getInsightWeather).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ sol_keys: [] });
    }
  });
});
