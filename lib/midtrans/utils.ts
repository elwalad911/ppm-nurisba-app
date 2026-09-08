import crypto from "crypto";

export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  receivedSignature: string
): boolean {
  const payload = orderId + statusCode + grossAmount + serverKey;
  const computedSignature = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");

  return computedSignature === receivedSignature;
}

export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "success" | "pending" | "failed" | "expired" {
  if (transactionStatus === "capture") {
    if (fraudStatus === "accept") {
      return "success";
    }
    return "failed";
  }
  if (transactionStatus === "settlement") {
    return "success";
  }
  if (transactionStatus === "pending") {
    return "pending";
  }
  if (
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "refund"
  ) {
    return "failed";
  }
  if (transactionStatus === "expire") {
    return "expired";
  }
  return "pending";
}
