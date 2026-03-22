import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "../../../../lib/admin-session";

export async function POST(request) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "";

    if (!adminEmail || adminPassword === "") {
      return NextResponse.json(
        { error: "إعدادات المسؤول غير مكتملة على الخادم." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." },
        { status: 401 },
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول." },
      { status: 500 },
    );
  }
}
