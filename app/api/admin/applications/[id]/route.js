import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";

const ALLOWED_STATUSES = ["REJECTED", "COMPLETED"];

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const body = await request.json();
    const status = body?.status;
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "حالة غير صالحة. استخدم REJECTED أو COMPLETED." },
        { status: 400 },
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "فشل التحميل" }, { status: 500 });
  }
}
