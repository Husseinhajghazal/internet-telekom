import { cookies } from "next/headers";
import { verifySessionToken } from "./admin-session";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return verifySessionToken(token);
}
