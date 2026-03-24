/**
 * Port for HTTP transport (Dependency Inversion). Swap for tests or other backends.
 */
export interface IHttpClient {
  getJson<T>(path: string, headers?: Record<string, string>): Promise<T>;
}
