import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";

export async function PUT(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const dataToUpdate = {};
    if (body.fullName) dataToUpdate.fullName = body.fullName;
    if (body.email) dataToUpdate.email = body.email;
    if (body.role) dataToUpdate.role = body.role;
    if (body.password) {
       dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "فشل التحديث. ربما الإيميل مستخدم." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Check if deleting themselves
    if (id === sessionUser.id) {
       return NextResponse.json({ error: "لا يمكنك حذف حسابك الشخصي" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "فشل החذف" }, { status: 500 });
  }
}
