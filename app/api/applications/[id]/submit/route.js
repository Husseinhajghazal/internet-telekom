import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { notifyApplicationSubmittedWhatsApp } from "../../../../../lib/whatsappNotify";

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
        status: "UNDER_REVIEW",
        step: Number.isInteger(step) && step >= 1 ? step : 6,
      },
    });

    try {
      await notifyApplicationSubmittedWhatsApp(updated);
    } catch (err) {
      console.error(
        "[whatsapp notify]",
        err?.message || err,
        err?.details || "",
      );
    }

    return NextResponse.json({
      id: updated.id,
      appIndex: updated.appIndex,
      status: updated.status,
      step: updated.step,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "فشل إرسال الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
