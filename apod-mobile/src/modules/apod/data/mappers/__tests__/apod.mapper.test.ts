import { ApodMapper } from "@/modules/apod/data/mappers/apod.mapper";

describe("ApodMapper", () => {
  it("maps a single DTO to ApodEntry", () => {
    const raw = {
      date: "2024-01-01",
      title: "Test",
      explanation: "Exp",
      url: "https://example.com/x.jpg",
      media_type: "image",
      hdurl: "https://example.com/hd.jpg",
      copyright: "NASA",
    };
    const out = ApodMapper.fromDto(raw);
    expect(Array.isArray(out)).toBe(false);
    if (!Array.isArray(out)) {
      expect(out.title).toBe("Test");
      expect(out.mediaType).toBe("image");
      expect(out.hdUrl).toBe("https://example.com/hd.jpg");
      expect(out.copyright).toBe("NASA");
    }
  });

  it("maps an array of DTOs", () => {
    const raw = [
      { date: "2024-01-01", title: "A", explanation: "", url: "", media_type: "image" },
      { date: "2024-01-02", title: "B", explanation: "", url: "", media_type: "image" },
    ];
    const out = ApodMapper.fromDto(raw);
    expect(Array.isArray(out)).toBe(true);
    if (Array.isArray(out)) {
      expect(out).toHaveLength(2);
      expect(out[0].title).toBe("A");
      expect(out[1].title).toBe("B");
    }
  });

  it("fills defaults for missing fields", () => {
    const out = ApodMapper.fromDto({});
    expect(Array.isArray(out)).toBe(false);
    if (!Array.isArray(out)) {
      expect(out.mediaType).toBe("unknown");
      expect(out.title).toBe("");
    }
  });
});
