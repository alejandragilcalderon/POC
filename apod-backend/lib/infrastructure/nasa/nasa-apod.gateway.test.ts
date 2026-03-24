import { describe, expect, it, vi } from "vitest";
import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";
import { NasaApodGateway } from "./nasa-apod.gateway";

describe("NasaApodGateway", () => {
  it("builds NASA URL with api_key and date", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ title: "M42" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const gateway = new NasaApodGateway({
      apiKey: "test-key",
      fetchImpl,
    });

    const out = await gateway.fetchApod({
      mode: { kind: "single", date: "2024-01-15" },
      thumbs: false,
    });

    expect(out).toEqual({ title: "M42" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("api.nasa.gov/planetary/apod");
    expect(url).toContain("api_key=test-key");
    expect(url).toContain("date=2024-01-15");
  });

  it("throws UpstreamHttpError on non-OK response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Bad key" } }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "Content-Type": "application/json" },
      })
    );

    const gateway = new NasaApodGateway({ apiKey: "bad", fetchImpl });

    await expect(
      gateway.fetchApod({ mode: { kind: "single" }, thumbs: false })
    ).rejects.toMatchObject({
      name: "UpstreamHttpError",
      statusCode: 403,
    });
  });

  it("UpstreamHttpError carries body for debugging", async () => {
    const body = { reason: "rate limit" };
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), { status: 429 })
    );
    const gateway = new NasaApodGateway({ apiKey: "k", fetchImpl });

    try {
      await gateway.fetchApod({ mode: { kind: "single" }, thumbs: false });
      expect.fail("expected throw");
    } catch (e) {
      expect(e).toBeInstanceOf(UpstreamHttpError);
      if (e instanceof UpstreamHttpError) {
        expect(e.body).toEqual(body);
        expect(e.statusCode).toBe(429);
      }
    }
  });
});
