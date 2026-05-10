import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12")));

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { isApproved: true } }),
    ]);

    return NextResponse.json({ reviews, total, totalPages: Math.ceil(total / limit), page });
  } catch {
    return NextResponse.json({ error: "فشل جلب التقييمات" }, { status: 500 });
  }
}
