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
        name: formData.get("name"),
        newName: formData.get("newName"),
        hasInternet: formData.get("hasInternet"),
        serviceType: formData.get("serviceType"),
        contractPreference: formData.get("contractPreference"),
        selectedService: formData.get("selectedService"),
        selectedPackage: formData.get("selectedPackage"),
        address: formData.get("address"),
        newAddress: formData.get("newAddress"),
        newPhone: formData.get("newPhone"),
        note: formData.get("note"),
        step: formData.get("step"),
        internetCompany: formData.get("internetCompany"),
        subscriptionNo: formData.get("subscriptionNo"),
        lastInvoiceAmount: formData.get("lastInvoiceAmount"),
        selectedInquiry: formData.get("selectedInquiry"),
        noContractTechType: formData.get("noContractTechType"),
      });

      const newInvoiceFiles = formData.getAll("invoiceFiles");
      const existingUrlsStr = formData.get("existingInvoiceFileUrls") || "";
      let allUrls = existingUrlsStr.split(",").filter(Boolean);

      if (newInvoiceFiles && newInvoiceFiles.length > 0) {
        const validNewUrls = await Promise.all(
          newInvoiceFiles
            .filter((f) => typeof f === "object" && f.size > 0)
            .map((f) => saveInvoiceFileLocally(f))
        );
        allUrls = [...allUrls, ...validNewUrls.filter(Boolean)];
      }

      if (formData.has("step") && formData.get("step") === "6") {
        draftPayload.invoiceFileUrl = allUrls.join(",") || null;
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
