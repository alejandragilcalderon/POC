import { rewriteLocalhostForAndroidEmulator } from "@/core/config/app-config";

describe("rewriteLocalhostForAndroidEmulator", () => {
  it("maps 127.0.0.1 to 10.0.2.2", () => {
    expect(rewriteLocalhostForAndroidEmulator("http://127.0.0.1:3000/api")).toBe(
      "http://10.0.2.2:3000/api"
    );
  });

  it("maps localhost to 10.0.2.2", () => {
    expect(rewriteLocalhostForAndroidEmulator("http://localhost:3000/api")).toBe(
      "http://10.0.2.2:3000/api"
    );
  });

  it("leaves other hosts unchanged", () => {
    expect(rewriteLocalhostForAndroidEmulator("http://192.168.1.5:3000/api")).toBe(
      "http://192.168.1.5:3000/api"
    );
  });
});
