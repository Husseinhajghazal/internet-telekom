import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "../../../../../../lib/admin-session";
import prisma from "../../../../../../lib/prisma";

const PAGE_SIZE = 20;

export async function GET(request, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = verifySessionToken(token);
  if (!session)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  if (session.role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const [total, rows] = await Promise.all([
    prisma.userSession.count({ where: { userId: id } }),
    prisma.userSession.findMany({
      where: { userId: id },
      orderBy: { loginAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  const sessions = rows.map((s) => {
    const end = s.logoutAt ?? s.lastSeenAt ?? null;
    return {
      id: s.id,
      loginAt: s.loginAt,
      logoutAt: s.logoutAt,
      lastSeenAt: s.lastSeenAt,
      durationMinutes: end
        ? Math.round((new Date(end) - new Date(s.loginAt)) / 60000)
        : null,
    };
  });

  return NextResponse.json({ sessions, total });
}
