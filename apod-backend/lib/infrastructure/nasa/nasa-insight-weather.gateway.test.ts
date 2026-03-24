import { describe, expect, it, vi } from "vitest";
import { NasaInsightWeatherGateway } from "./nasa-insight-weather.gateway";

describe("NasaInsightWeatherGateway", () => {
  it("builds NASA URL with api_key, feedtype, and ver", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ sol_keys: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const gateway = new NasaInsightWeatherGateway({
      apiKey: "test-key",
      fetchImpl,
    });

    const out = await gateway.fetchWeather();

    expect(out).toEqual({ sol_keys: [] });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("api.nasa.gov/insight_weather/");
    expect(url).toContain("api_key=test-key");
    expect(url).toContain("feedtype=json");
    expect(url).toContain("ver=1.0");
  });

  it("throws UpstreamHttpError on non-OK response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Bad key" } }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "Content-Type": "application/json" },
      })
    );

    const gateway = new NasaInsightWeatherGateway({ apiKey: "bad", fetchImpl });

    await expect(gateway.fetchWeather()).rejects.toMatchObject({
      name: "UpstreamHttpError",
      statusCode: 403,
    });
  });
});
