import { fail, ok } from "@/core/types/result";

describe("Result helpers", () => {
  it("ok wraps value", () => {
    const r = ok(42);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(42);
  });

  it("fail wraps error", () => {
    const r = fail<string, { code: string }>({ code: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("x");
  });
});
