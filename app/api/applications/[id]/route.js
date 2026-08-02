import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import {
  deleteInvoiceFiles,
  normalizeDraftPayload,
  parseInvoiceFileUrls,
  saveInvoiceFileLocally,
} from "../../../../lib/application";

const sanitizeUpdatePayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );

export async function PATCH(request, { params }) {
  // Files written during this request, so they can be unlinked if the update fails.
  let writtenFileUrls = [];
  let keptUrls = [];
  let replacesInvoices = false;

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
        addressCode: formData.get("addressCode"),
        newAddressCode: formData.get("newAddressCode"),
        originalAddress: formData.get("originalAddress"),
        originalAddressText: formData.get("originalAddressText"),
        newOriginalAddress: formData.get("newOriginalAddress"),
        newOriginalAddressText: formData.get("newOriginalAddressText"),
        note: formData.get("note"),
        step: formData.get("step"),
        internetCompany: formData.get("internetCompany"),
        subscriptionNo: formData.get("subscriptionNo"),
        lastInvoiceAmount: formData.get("lastInvoiceAmount"),
        selectedInquiry: formData.get("selectedInquiry"),
        noContractTechType: formData.get("noContractTechType"),
        newNationalNumber: formData.get("newNationalNumber"),
        electronicApproval: formData.get("electronicApproval"),
        approvalViaShipping: formData.get("approvalViaShipping"),
        paidByUserName: formData.get("paidByUserName"),
        paidByName: formData.get("paidByName"),
        discountCount: formData.get("discountCount"),
      });

      const newInvoiceFiles = formData.getAll("invoiceFiles[]").length > 0 ? formData.getAll("invoiceFiles[]") : formData.getAll("invoiceFiles");
      keptUrls = parseInvoiceFileUrls(formData.get("existingInvoiceFileUrls"));

      const pendingFiles = (newInvoiceFiles || []).filter(
        (f) => typeof f === "object" && f.size > 0,
      );
      if (pendingFiles.length) {
        writtenFileUrls = (
          await Promise.all(pendingFiles.map((f) => saveInvoiceFileLocally(f)))
        ).filter(Boolean);
      }

      if (formData.has("step") && formData.get("step") === "6") {
        draftPayload.invoiceFileUrl =
          [...keptUrls, ...writtenFileUrls].join(",") || null;
        replacesInvoices = true;
      }
    } else {
      draftPayload = normalizeDraftPayload(await request.json());
    }

    const data = sanitizeUpdatePayload(draftPayload);
    // Step 6 recomputes the whole invoice list, so an emptied list has to persist
    // as null. sanitizeUpdatePayload strips nulls, which made "remove every
    // invoice" a silent no-op — the row kept pointing at the old files.
    if (replacesInvoices) {
      data.invoiceFileUrl = draftPayload.invoiceFileUrl ?? null;
    }

    if (!Object.keys(data).length) {
      await deleteInvoiceFiles(writtenFileUrls);
      return NextResponse.json(
        { error: "لا يوجد حقول مطلوبة للتحديث." },
        { status: 400 },
      );
    }

    const previous = replacesInvoices
      ? await prisma.application.findUnique({
          where: { id },
          select: { invoiceFileUrl: true },
        })
      : null;

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

    // Invoices the customer removed are no longer referenced — drop them from disk.
    if (replacesInvoices) {
      const removed = parseInvoiceFileUrls(previous?.invoiceFileUrl).filter(
        (url) => !keptUrls.includes(url),
      );
      await deleteInvoiceFiles(removed);
    }

    return NextResponse.json(updated);
  } catch (error) {
    // The row still points at its old files, so anything written here is unreferenced.
    await deleteInvoiceFiles(writtenFileUrls);

    if (error?.code === "INVALID_UPLOAD") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "فشل تحديث الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
