import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppContainer } from "@/lib/composition/app.container";
import type { AppContainer } from "@/lib/composition/app.container";
import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";
import { GET } from "./route";

vi.mock("@/lib/composition/app.container", () => ({
  createAppContainer: vi.fn(),
}));

const mockedCreate = vi.mocked(createAppContainer);

describe("GET /api/insight-weather", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with JSON from the use case", async () => {
    mockedCreate.mockReturnValue({
      getApod: { execute: vi.fn() },
      getInsightWeather: {
        execute: vi.fn().mockResolvedValue({ sol_keys: ["1000"], validity_checks: {} }),
      },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      sol_keys: ["1000"],
      validity_checks: {},
    });
    expect(mockedCreate).toHaveBeenCalledOnce();
  });

  it("maps UpstreamHttpError to JSON with upstream status", async () => {
    mockedCreate.mockReturnValue({
      getApod: { execute: vi.fn() },
      getInsightWeather: {
        execute: vi.fn().mockRejectedValue(new UpstreamHttpError(429, "Too Many", { x: 1 })),
      },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const res = await GET();
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("Upstream Error");
    expect(body.message).toBe("Too Many");
    expect(body.details).toEqual({ x: 1 });
  });

  it("rethrows unexpected errors", async () => {
    mockedCreate.mockReturnValue({
      getApod: { execute: vi.fn() },
      getInsightWeather: {
        execute: vi.fn().mockRejectedValue(new Error("boom")),
      },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    await expect(GET()).rejects.toThrow("boom");
  });
});
