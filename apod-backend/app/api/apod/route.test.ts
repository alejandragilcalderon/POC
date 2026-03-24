import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppContainer } from "@/lib/composition/app.container";
import type { AppContainer } from "@/lib/composition/app.container";
import { UpstreamHttpError } from "@/lib/domain/errors/upstream-http.error";
import { GET } from "./route";

vi.mock("@/lib/composition/app.container", () => ({
  createAppContainer: vi.fn(),
}));

const mockedCreate = vi.mocked(createAppContainer);

describe("GET /api/apod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when query params are invalid", async () => {
    const req = new NextRequest(
      "http://localhost/api/apod?date=2024-01-01&count=2"
    );
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Bad Request");
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("returns 200 with JSON from the use case", async () => {
    mockedCreate.mockReturnValue({
      getApod: {
        execute: vi
          .fn()
          .mockResolvedValue({ title: "Pillars", date: "2024-01-01" }),
      },
      getInsightWeather: { execute: vi.fn() },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const req = new NextRequest("http://localhost/api/apod?date=2024-01-01");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      title: "Pillars",
      date: "2024-01-01",
    });
    expect(mockedCreate).toHaveBeenCalledOnce();
  });

  it("maps UpstreamHttpError to JSON with upstream status", async () => {
    mockedCreate.mockReturnValue({
      getApod: {
        execute: vi
          .fn()
          .mockRejectedValue(new UpstreamHttpError(404, "Not found", { msg: "x" })),
      },
      getInsightWeather: { execute: vi.fn() },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const req = new NextRequest("http://localhost/api/apod");
    const res = await GET(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Upstream Error");
    expect(body.message).toBe("Not found");
    expect(body.details).toEqual({ msg: "x" });
  });

  it("uses 502 when upstream status is not a client/server HTTP code", async () => {
    mockedCreate.mockReturnValue({
      getApod: {
        execute: vi.fn().mockRejectedValue(new UpstreamHttpError(0, "weird", null)),
      },
      getInsightWeather: { execute: vi.fn() },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const req = new NextRequest("http://localhost/api/apod");
    const res = await GET(req);
    expect(res.status).toBe(502);
  });

  it("rethrows unexpected errors", async () => {
    mockedCreate.mockReturnValue({
      getApod: {
        execute: vi.fn().mockRejectedValue(new Error("boom")),
      },
      getInsightWeather: { execute: vi.fn() },
      getHealth: { execute: vi.fn() },
    } as AppContainer);

    const req = new NextRequest("http://localhost/api/apod");
    await expect(GET(req)).rejects.toThrow("boom");
  });
});
