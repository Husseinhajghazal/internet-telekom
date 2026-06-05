import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { buildApplicationWhatsAppMessageAr } from "../../../../../lib/applicationWhatsAppAr";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "رقم الطلب مطلوب." }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const step = Number(body?.step);

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: "COMPLETED",
        step: Number.isInteger(step) && step >= 1 ? step : 6,
      },
    });

    let whatsappText = "";
    try {
      whatsappText = buildApplicationWhatsAppMessageAr(updated);
    } catch (err) {
      console.error("[whatsapp text]", err?.message || err);
    }

    return NextResponse.json({
      id: updated.id,
      appIndex: updated.appIndex,
      status: updated.status,
      step: updated.step,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      whatsappText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل إرسال الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
