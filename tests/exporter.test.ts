import { describe, it, expect } from "vitest";
import { sanitizeCsvField } from "../src/lib/exporter";

describe("CSV Export Formula Sanitization", () => {
  it("sanitizes dangerous spreadsheet formula prefix characters", () => {
    expect(sanitizeCsvField("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvField("+12345")).toBe("'+12345");
    expect(sanitizeCsvField("-danger")).toBe("'-danger");
    expect(sanitizeCsvField("@cmd")).toBe("'@cmd");
    expect(sanitizeCsvField("\tcmd")).toBe("'\tcmd");
  });

  it("leaves benign strings unmodified", () => {
    expect(sanitizeCsvField("Week 1: Advanced TypeScript")).toBe("Week 1: Advanced TypeScript");
    expect(sanitizeCsvField("w01_t01")).toBe("w01_t01");
    expect(sanitizeCsvField("20")).toBe("20");
    expect(sanitizeCsvField("true")).toBe("true");
    expect(sanitizeCsvField("")).toBe("");
    expect(sanitizeCsvField(null)).toBe("");
    expect(sanitizeCsvField(undefined)).toBe("");
  });
});
