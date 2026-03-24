import { ok } from "@/core/types/result";
import { GetApodUseCase } from "@/modules/apod/application/get-apod.use-case";
import type { IApodRepository } from "@/modules/apod/domain/ports/apod-repository.port";

describe("GetApodUseCase", () => {
  it("delegates to repository", async () => {
    const getApod = jest.fn().mockResolvedValue(
      ok({
        date: "2024-01-01",
        title: "T",
        explanation: "",
        url: "",
        mediaType: "image",
      })
    );
    const repo: IApodRepository = { getApod };
    const uc = new GetApodUseCase(repo);

    const q = { mode: "single" as const };
    const result = await uc.execute(q);

    expect(getApod).toHaveBeenCalledWith(q);
    expect(result.ok).toBe(true);
  });
});
