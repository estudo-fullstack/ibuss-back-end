import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type PasswordResetToken = {
  token: string;
  tokenHash: string;
};

export function generatePasswordResetToken(): PasswordResetToken {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHmac("sha256", process.env.PASSWORD_RESET_TOKEN_SECRET!)
    .update(token)
    .digest("hex");

  return {
    token,
    tokenHash,
  };
}

export function verifyPasswordResetToken(token: string, storedTokenHash: string): boolean {
  const calculatedHash = createHmac("sha256", process.env.PASSWORD_RESET_TOKEN_SECRET!)
    .update(token)
    .digest("hex");

  const calculatedBuffer = Buffer.from(calculatedHash, "hex");
  const storedBuffer = Buffer.from(storedTokenHash, "hex");

  if (calculatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, storedBuffer);
}

export function buildPasswordResetLink(token: string, id: string) {
  return `${process.env.URL_RESET_PASSWORD}?id=${id}&token=${token}`;
}
