import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { generateAppCode } from "../../../lib/application";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const phone = body?.phone?.trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "الاسم ورقم الهاتف مطلوبان." },
        { status: 400 },
      );
    }

    let application = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        application = await prisma.application.create({
          data: {
            appCode: generateAppCode(),
            name,
            phone,
            status: "NOT_COMPLETED",
            step: 1,
          },
          select: {
            id: true,
            appCode: true,
            status: true,
            step: true,
            createdAt: true,
          },
        });
        break;
      } catch (error) {
        if (error?.code !== "P2002" || attempt === 4) {
          throw error;
        }
      }
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل إنشاء الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
