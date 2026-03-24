export class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly body: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
