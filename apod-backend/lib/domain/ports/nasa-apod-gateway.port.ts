import type { ApodQuery } from "@/lib/domain/apod-query";

/**
 * Outbound port: NASA Astronomy Picture of the Day HTTP API.
 */
export interface NasaApodGatewayPort {
  fetchApod(query: ApodQuery): Promise<unknown>;
}
