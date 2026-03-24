import type { IHttpClient } from "@/core/network/http-client.interface";
import type { ApodQuery } from "@/modules/apod/domain/entities/apod-query";

type Deps = {
  httpClient: IHttpClient;
  /** e.g. "/apod" when base URL already includes `/api` */
  apodPath: string;
};

function toSearchParams(query: ApodQuery): string {
  const p = new URLSearchParams();
  if (query.mode === "single") {
    if (query.date) p.set("date", query.date);
  } else if (query.mode === "range") {
    p.set("start_date", query.startDate);
    if (query.endDate) p.set("end_date", query.endDate);
  } else {
    p.set("count", String(query.count));
  }
  if (query.thumbs) p.set("thumbs", "true");
  return p.toString();
}

/**
 * Remote APOD data source (HTTP only; no client-side auth).
 */
export class ApodRemoteDataSource {
  constructor(private readonly deps: Deps) {}

  async fetchApod(query: ApodQuery): Promise<unknown> {
    const qs = toSearchParams(query);
    const path = qs ? `${this.deps.apodPath}?${qs}` : this.deps.apodPath;
    return this.deps.httpClient.getJson<unknown>(path);
  }
}
