import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";

export async function DELETE(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Note error:", error);
    return NextResponse.json({ error: "تعذر حذف الملاحظة" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: { text: text.trim() },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Note error:", error);
    return NextResponse.json({ error: "تعذر تعديل الملاحظة" }, { status: 500 });
  }
}
