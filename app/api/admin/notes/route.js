import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, adminName, applicationId } = body;

    if (!text?.trim() || !adminName?.trim() || !applicationId) {
      return NextResponse.json(
        { error: "البيانات المطلوبة مفقودة" },
        { status: 400 },
      );
    }

    const newNote = await prisma.note.create({
      data: {
        text,
        adminName,
        applicationId,
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("POST Note error:", error);
    return NextResponse.json(
      { error: "تعذر إضافة الملاحظة" },
      { status: 500 },
    );
  }
}
