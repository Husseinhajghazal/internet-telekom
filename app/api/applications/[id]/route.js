import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { normalizeDraftPayload, saveInvoiceFileLocally } from "../../../../lib/application";

const sanitizeUpdatePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );

export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "رقم الطلب مطلوب." }, { status: 400 });
    }
    const contentType = request.headers.get("content-type") || "";
    let draftPayload = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      draftPayload = normalizeDraftPayload({
        hasInternet: formData.get("hasInternet"),
        serviceType: formData.get("serviceType"),
        contractPreference: formData.get("contractPreference"),
        selectedService: formData.get("selectedService"),
        selectedPackage: formData.get("selectedPackage"),
        address: formData.get("address"),
        note: formData.get("note"),
        step: formData.get("step"),
      });

      const invoiceFile = formData.get("invoiceFile");
      if (invoiceFile && typeof invoiceFile === "object" && invoiceFile.size > 0) {
        draftPayload.invoiceFileUrl = await saveInvoiceFileLocally(invoiceFile);
      }
    } else {
      draftPayload = normalizeDraftPayload(await request.json());
    }

    const data = sanitizeUpdatePayload(draftPayload);
    if (!Object.keys(data).length) {
      return NextResponse.json(
        { error: "لا يوجد حقول مطلوبة للتحديث." },
        { status: 400 },
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data,
      select: {
        id: true,
        status: true,
        step: true,
        invoiceFileUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "فشل تحديث الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
