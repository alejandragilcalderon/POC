import { buildHealthPayload, type HealthPayload } from "./build-health-payload";

/**
 * Application: process liveness payload.
 */
export class GetHealthUseCase {
  execute(): HealthPayload {
    return buildHealthPayload();
  }
}
