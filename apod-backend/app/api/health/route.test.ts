import { describe, expect, it, vi } from "vitest";
import * as healthPayload from "@/lib/application/health/build-health-payload";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with JSON body from buildHealthPayload", async () => {
    const spy = vi.spyOn(healthPayload, "buildHealthPayload").mockReturnValue({
      status: "ok",
      service: "apod-backend",
      version: "0.1.0",
      timestamp: "2025-01-01T00:00:00.000Z",
    });

    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/application\/json/);
    expect(await res.json()).toEqual({
      status: "ok",
      service: "apod-backend",
      version: "0.1.0",
      timestamp: "2025-01-01T00:00:00.000Z",
    });
    expect(spy).toHaveBeenCalledOnce();

    spy.mockRestore();
  });
});
