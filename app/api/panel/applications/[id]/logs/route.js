import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../../lib/admin-api";

export async function GET(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const logs = await prisma.applicationLog.findMany({
      where: { applicationId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Logs fetch error:", error);
    return NextResponse.json({ error: "فشل تحميل السجلات" }, { status: 500 });
  }
}
