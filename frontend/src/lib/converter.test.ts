import { describe, expect, it } from "vitest";

import { buildDemoJob, formatBytes, getApiBaseUrl, validateUpload } from "./converter";

describe("converter utilities", () => {
  it("formats byte sizes for Indonesian users", () => {
    expect(formatBytes(1_500_000)).toBe("1,5 MB");
  });

  it("validates file size and accepted extensions", () => {
    const file = new File(["hello"], "cat.png", { type: "image/png" });
    expect(validateUpload(file, ["png", "jpg"], 10)).toBeNull();
    expect(validateUpload(new File(["x"], "bad.exe"), ["png"], 10)).toContain("format");
  });

  it("marks fallback jobs as simulated demos", () => {
    expect(buildDemoJob("foto.png", "jpg")).toMatchObject({
      simulated: true,
      status: "completed",
      target_format: "jpg",
    });
  });

  it("uses the configured backend URL and defaults to the active host on port 8765", () => {
    expect(getApiBaseUrl("http://192.168.1.20:3000", "")).toBe("http://192.168.1.20:8765");
    expect(getApiBaseUrl("http://127.0.0.1:3000", "http://127.0.0.1:9000/"))
      .toBe("http://127.0.0.1:9000");
  });
});
