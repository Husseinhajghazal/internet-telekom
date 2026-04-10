import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { isAdminAuthenticated } from "../../../../lib/admin-api";
import { createSessionToken } from "../../../../lib/admin-session";
import { cookies } from "next/headers";

export async function GET(request) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, fullName: true, email: true, role: true }
    });
    return NextResponse.json(user);
  } catch(e) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

export async function PUT(request) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const dataToUpdate = {};
    if (body.fullName) dataToUpdate.fullName = body.fullName;
    if (body.email) dataToUpdate.email = body.email;
    if (body.password) {
       dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: dataToUpdate,
    });

    // Update token
    const token = createSessionToken(updatedUser);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "فشل التحديث. الإيميل قد يكون مستخدماً." }, { status: 500 });
  }
}
