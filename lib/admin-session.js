import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_DEV_SECRET = "dev-admin-session-secret-change-in-production";

/**
 * Signed session token (HMAC). Used only on the server (API routes + Server Components).
 */
export function createSessionToken(user) {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_DEV_SECRET;
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ 
    exp, 
    v: 2, 
    id: user.id, 
    role: user.role, 
    fullName: user.fullName 
  })).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_DEV_SECRET;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
