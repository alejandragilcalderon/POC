import { describe, expect, it } from "vitest";
import { buildHealthPayload } from "./build-health-payload";

describe("buildHealthPayload", () => {
  it("returns ok status and ISO timestamp for a fixed clock", () => {
    const fixed = new Date("2025-03-23T12:00:00.000Z");
    const payload = buildHealthPayload(fixed);
    expect(payload).toEqual({
      status: "ok",
      service: "apod-backend",
      version: "0.1.0",
      timestamp: "2025-03-23T12:00:00.000Z",
    });
  });
});
