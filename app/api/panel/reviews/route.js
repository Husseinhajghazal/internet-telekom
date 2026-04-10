import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

export async function GET(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "فشل تحميل التقييمات" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = {
      name: body.name || "بدون اسم",
      rating: parseInt(body.rating) || 5,
      comment: body.comment || "",
      service: body.service || "",
    };
    const review = await prisma.review.create({ data });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "فشل إنشاء التقييم" }, { status: 500 });
  }
}
