import { describe, it, expect } from "vitest";
import { verifySignature, mapMidtransStatus } from "./utils";
import crypto from "crypto";

describe("Midtrans Utils", () => {
  const serverKey = "SB-Mid-server-testkey";

  it("should verify valid signature correctly", () => {
    const orderId = "NURRISBA-123";
    const statusCode = "200";
    const grossAmount = "100000.00";

    const payload = orderId + statusCode + grossAmount + serverKey;
    const validSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    const isValid = verifySignature(
      orderId,
      statusCode,
      grossAmount,
      serverKey,
      validSignature
    );
    expect(isValid).toBe(true);
  });

  it("should reject invalid signature", () => {
    const isValid = verifySignature(
      "NURRISBA-123",
      "200",
      "100000.00",
      serverKey,
      "wrongsignature"
    );
    expect(isValid).toBe(false);
  });

  it("should map transaction statuses correctly", () => {
    expect(mapMidtransStatus("settlement")).toBe("success");
    expect(mapMidtransStatus("capture", "accept")).toBe("success");
    expect(mapMidtransStatus("capture", "challenge")).toBe("failed");
    expect(mapMidtransStatus("pending")).toBe("pending");
    expect(mapMidtransStatus("deny")).toBe("failed");
    expect(mapMidtransStatus("cancel")).toBe("failed");
    expect(mapMidtransStatus("expire")).toBe("expired");
    expect(mapMidtransStatus("unknown")).toBe("pending");
  });
});
