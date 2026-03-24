import type { Result } from "@/core/types/result";
import type { ApodPayload } from "@/modules/apod/domain/entities/apod-entry";
import type { ApodQuery } from "@/modules/apod/domain/entities/apod-query";

export type ApodFailure =
  | { kind: "unauthorized" }
  | { kind: "network"; message: string }
  | { kind: "upstream"; status: number; message: string; details?: unknown };

export interface IApodRepository {
  getApod(query: ApodQuery): Promise<Result<ApodPayload, ApodFailure>>;
}
