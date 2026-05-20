import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "../../../../lib/admin-session";
import prisma from "../../../../lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const data = verifySessionToken(token);
    if (!data?.sid) return NextResponse.json({ ok: false }, { status: 401 });

    await prisma.userSession.updateMany({
      where: { id: data.sid, logoutAt: null },
      data: { lastSeenAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
