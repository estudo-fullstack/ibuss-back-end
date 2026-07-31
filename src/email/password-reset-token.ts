import { createHmac, randomBytes } from "node:crypto";

export type PasswordResetToken = {
  token: string;
  tokenHash: string;
};

export function generatePasswordResetToken(): PasswordResetToken {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHmac("sha256", "").update(token).digest("hex");

  return {
    token,
    tokenHash,
  };
}

export function buildPasswordResetLink(token: string) {
  return `${process.env.URL_RESET_PASSWORD}?token=${token}`;
}
