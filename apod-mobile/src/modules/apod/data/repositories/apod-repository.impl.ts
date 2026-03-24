import { ApiError } from "@/core/network/api-error";
import { ok, fail, type Result } from "@/core/types/result";
import type { ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import type { ApodQuery } from "@/modules/apod/domain/entities/apod-query";
import type {
  ApodFailure,
  IApodRepository,
} from "@/modules/apod/domain/ports/apod-repository.port";
import { ApodMapper } from "@/modules/apod/data/mappers/apod.mapper";
import type { ApodRemoteDataSource } from "@/modules/apod/data/datasources/apod-remote.datasource";

export class ApodRepositoryImpl implements IApodRepository {
  constructor(private readonly remote: ApodRemoteDataSource) {}

  async getApod(query: ApodQuery): Promise<Result<ApodPayload, ApodFailure>> {
    try {
      const raw = await this.remote.fetchApod(query);
      const value = ApodMapper.fromDto(raw);
      return ok(value);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.statusCode === 401) {
          return fail({ kind: "unauthorized" });
        }
        return fail({
          kind: "upstream",
          status: e.statusCode,
          message: e.message,
          details: e.body,
        });
      }
      const message = e instanceof Error ? e.message : "Request failed";
      return fail({ kind: "network", message });
    }
  }
}
