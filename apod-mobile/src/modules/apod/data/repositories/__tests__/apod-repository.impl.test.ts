import { ApiError } from "@/core/network/api-error";
import { ApodRepositoryImpl } from "@/modules/apod/data/repositories/apod-repository.impl";
import type { ApodRemoteDataSource } from "@/modules/apod/data/datasources/apod-remote.datasource";

describe("ApodRepositoryImpl", () => {
  it("returns ok with mapped payload", async () => {
    const remote: Pick<ApodRemoteDataSource, "fetchApod"> = {
      fetchApod: jest.fn().mockResolvedValue({
        date: "2024-01-01",
        title: "Hi",
        explanation: "E",
        url: "u",
        media_type: "image",
      }),
    };
    const repo = new ApodRepositoryImpl(remote as ApodRemoteDataSource);

    const result = await repo.getApod({ mode: "single" });

    expect(result.ok).toBe(true);
    if (result.ok && !Array.isArray(result.value)) {
      expect(result.value.title).toBe("Hi");
    }
  });

  it("maps ApiError 401 to unauthorized", async () => {
    const remote: Pick<ApodRemoteDataSource, "fetchApod"> = {
      fetchApod: jest.fn().mockRejectedValue(new ApiError(401, "nope", {})),
    };
    const repo = new ApodRepositoryImpl(remote as ApodRemoteDataSource);

    const result = await repo.getApod({ mode: "single" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("unauthorized");
  });

  it("maps other ApiError to upstream", async () => {
    const remote: Pick<ApodRemoteDataSource, "fetchApod"> = {
      fetchApod: jest.fn().mockRejectedValue(new ApiError(503, "busy", { x: 1 })),
    };
    const repo = new ApodRepositoryImpl(remote as ApodRemoteDataSource);

    const result = await repo.getApod({ mode: "single" });

    expect(result.ok).toBe(false);
    if (!result.ok && result.error.kind === "upstream") {
      expect(result.error.status).toBe(503);
      expect(result.error.message).toBe("busy");
    }
  });

  it("maps generic errors to network", async () => {
    const remote: Pick<ApodRemoteDataSource, "fetchApod"> = {
      fetchApod: jest.fn().mockRejectedValue(new Error("offline")),
    };
    const repo = new ApodRepositoryImpl(remote as ApodRemoteDataSource);

    const result = await repo.getApod({ mode: "single" });

    expect(result.ok).toBe(false);
    if (!result.ok && result.error.kind === "network") {
      expect(result.error.message).toBe("offline");
    }
  });
});
