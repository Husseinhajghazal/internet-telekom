import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request) {
  try {
    const { appId, rating, comment } = await request.json();
    if (!appId || !rating || !comment) {
      return NextResponse.json({ error: "الرجاء إكمال كافة البيانات" }, { status: 400 });
    }

    const app = await prisma.application.findUnique({
      where: { id: appId },
      include: { Review: true }
    });

    if (!app) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    if (app.Review) {
      return NextResponse.json({ error: "لقد قمت بإضافة تقييم مسبقاً لهذا الطلب" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        name: app.newName || app.name || "بدون اسم",
        service: app.service || "خدمة الإنترنت",
        rating: parseInt(rating),
        comment,
        isApproved: false,
        applicationId: app.id,
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
