import pkg from "../../../package.json";

export type HealthPayload = {
  status: "ok";
  service: string;
  version: string;
  timestamp: string;
};

/**
 * Liveness payload for GET /api/health (no upstream or DB).
 */
export function buildHealthPayload(now: Date = new Date()): HealthPayload {
  return {
    status: "ok",
    service: pkg.name,
    version: pkg.version,
    timestamp: now.toISOString(),
  };
}
