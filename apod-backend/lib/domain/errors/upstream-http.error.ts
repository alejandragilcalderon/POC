/**
 * Non-OK response from an HTTP upstream (NASA API). Application and interface layers map this to HTTP.
 */
export class UpstreamHttpError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly body: unknown
  ) {
    super(message);
    this.name = "UpstreamHttpError";
  }
}
