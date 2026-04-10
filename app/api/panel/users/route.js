import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

export async function GET(request) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "فشل تحميل المستخدمين" }, { status: 500 });
  }
}

export async function POST(request) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "هذا الإيميل مستخدم مسبقاً" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || "EMPLOYEE",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(newUser);
  } catch (err) {
    return NextResponse.json({ error: "فشل إنشاء الحساب" }, { status: 500 });
  }
}
