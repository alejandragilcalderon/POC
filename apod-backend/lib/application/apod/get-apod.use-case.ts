import type { ApodQuery } from "@/lib/domain/apod-query";
import type { NasaApodGatewayPort } from "@/lib/domain/ports/nasa-apod-gateway.port";

/**
 * Application: fetch APOD data for a validated query (single entry point for this feature).
 */
export class GetApodUseCase {
  constructor(private readonly nasaApod: NasaApodGatewayPort) {}

  execute(query: ApodQuery): Promise<unknown> {
    return this.nasaApod.fetchApod(query);
  }
}
