import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../../../lib/admin-session";

export default async function AdminPanelLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
