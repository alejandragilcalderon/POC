import type { Result } from "@/core/types/result";
import type { ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import type { ApodQuery } from "@/modules/apod/domain/entities/apod-query";
import type {
  ApodFailure,
  IApodRepository,
} from "@/modules/apod/domain/ports/apod-repository.port";

export class GetApodUseCase {
  constructor(private readonly apod: IApodRepository) {}

  execute(query: ApodQuery): Promise<Result<ApodPayload, ApodFailure>> {
    return this.apod.getApod(query);
  }
}
