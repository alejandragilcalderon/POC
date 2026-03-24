import { describe, expect, it } from "vitest";
import { parseApodQueryParams } from "./apod-query.parser";

describe("parseApodQueryParams", () => {
  it("parses default (today) single mode when no date params", () => {
    const r = parseApodQueryParams(new URLSearchParams());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.mode).toEqual({ kind: "single" });
    expect(r.value.thumbs).toBe(false);
  });

  it("parses date-only query", () => {
    const r = parseApodQueryParams(new URLSearchParams("date=2024-03-15"));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toEqual({
      mode: { kind: "single", date: "2024-03-15" },
      thumbs: false,
    });
  });

  it("rejects invalid date format", () => {
    const r = parseApodQueryParams(new URLSearchParams("date=24-03-15"));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toMatch(/YYYY-MM-DD/);
  });

  it("rejects date together with start_date", () => {
    const r = parseApodQueryParams(
      new URLSearchParams("date=2024-01-01&start_date=2024-01-02")
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toContain("date cannot be used together with start_date");
  });

  it("rejects date together with count", () => {
    const r = parseApodQueryParams(new URLSearchParams("date=2024-01-01&count=3"));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toContain("date cannot be used together with count");
  });

  it("rejects range together with count", () => {
    const r = parseApodQueryParams(
      new URLSearchParams("start_date=2024-01-01&count=2")
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toContain("start_date/end_date cannot be used together with count");
  });

  it("parses random count mode", () => {
    const r = parseApodQueryParams(new URLSearchParams("count=5"));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.mode).toEqual({ kind: "random", count: 5 });
  });

  it("rejects non-positive count", () => {
    const r = parseApodQueryParams(new URLSearchParams("count=0"));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toContain("positive integer");
  });

  it("parses range with start_date only", () => {
    const r = parseApodQueryParams(new URLSearchParams("start_date=2024-01-01"));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.mode).toEqual({
      kind: "range",
      start_date: "2024-01-01",
      end_date: undefined,
    });
  });

  it("requires start_date when end_date is present", () => {
    const r = parseApodQueryParams(new URLSearchParams("end_date=2024-01-31"));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.message).toContain("end_date requires start_date");
  });

  it("parses thumbs as true for true, 1, yes", () => {
    for (const v of ["true", "1", "yes"]) {
      const r = parseApodQueryParams(
        new URLSearchParams(`date=2024-06-01&thumbs=${v}`)
      );
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      expect(r.value.thumbs).toBe(true);
    }
  });
});
