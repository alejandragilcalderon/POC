import {
  formatUpstreamMessage,
  friendlyHttpStatus,
  friendlyNetworkMessage,
} from "@/shared/ui/utils/format-api-error";

describe("format-api-error", () => {
  it("friendlyHttpStatus maps known codes", () => {
    expect(friendlyHttpStatus(404)).toMatch(/couldn’t find/);
    expect(friendlyHttpStatus(500)).toMatch(/server had a problem/);
  });

  it("formatUpstreamMessage hides generic server text", () => {
    const out = formatUpstreamMessage(500, "Internal Server Error");
    expect(out).toContain("code 500");
    expect(out).not.toContain("Details:");
  });

  it("formatUpstreamMessage keeps useful details", () => {
    const out = formatUpstreamMessage(502, "upstream timeout");
    expect(out).toContain("Details:");
    expect(out).toContain("upstream timeout");
  });

  it("friendlyNetworkMessage explains unreachable API", () => {
    expect(friendlyNetworkMessage("Network request failed")).toMatch(/couldn’t reach/);
  });
});
