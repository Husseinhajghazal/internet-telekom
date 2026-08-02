import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";
import {
  deleteInvoiceFiles,
  diffApplication,
  parseInvoiceFileUrls,
  saveInvoiceFileLocally,
} from "../../../../../lib/application";

/**
 * Every member of the ApplicationStatus enum. Must stay in sync with
 * prisma/schema.prisma and STATUS_LABELS — the panel decides per view which of
 * these it offers, so a short list here rejects statuses the UI legitimately
 * shows (previously OPEN_REGISTRATION on the services page and the six
 * UNDER_* statuses on the expiring page all failed with "حالة غير صالحة").
 */
const ALLOWED_STATUSES = [
  "NOT_COMPLETED",
  "NEW",
  "UNDER_REVIEW",
  "UNDER_OBSERVATION",
  "DELAYED",
  "REJECTED",
  "COMPLETED",
  "TECHNICAL_PROBLEM",
  "TRYING_TO_PERSUADE",
  "ACTIVATED",
  "WAITING_FOR_PORT",
  "UNDER_INSTALLATION",
  "UNDER_FREEZING",
  "UNDER_CANCELING",
  "UNDER_CHANGE",
  "UNDER_TRANSFER",
  "UNDER_RENEW",
  "OPEN_REGISTRATION",
];

export async function PATCH(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const body = await request.json();
    const data = {};

    let existingAppForPatch = null;
    if (body.adminNote !== undefined) {
      existingAppForPatch = await prisma.application.findUnique({
        where: { id },
        select: { adminNote: true },
      });
    }

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "حالة غير صالحة." },
          { status: 400 },
        );
      }
      data.status = body.status;
      // completedAt now tracks the activation date ("تاريخ التفعيل").
      if (body.status === "ACTIVATED") {
        data.completedAt = new Date();
        data.delayedUntil = null;
      } else if (body.status === "DELAYED") {
        data.completedAt = null;
        if (body.delayedUntil) {
          data.delayedUntil = new Date(body.delayedUntil);
        }
      } else {
        data.completedAt = null;
        data.delayedUntil = null;
      }
    }

    if (body.adminNote !== undefined) {
      data.adminNote = body.adminNote;
      if (existingAppForPatch && existingAppForPatch.adminNote !== body.adminNote) {
        data.adminNoteViewed = false;
      }
    }

    if (body.isDeleted !== undefined) {
      if (sessionUser.role !== "ADMIN") {
        return NextResponse.json({ error: "غير مصرح بالحذف" }, { status: 403 });
      }
      data.isDeleted = body.isDeleted;
    }

    if (body.serviceType !== undefined) {
      data.serviceType = body.serviceType;
    }

    if (body.whatsappStatus !== undefined) {
      data.whatsappStatus = body.whatsappStatus;
    }

    if (body.reminderSent !== undefined) {
      data.reminderSent = body.reminderSent;
    }

    if (body.status !== undefined) {
      data.reminderSent = false;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "لا يوجد بيانات لتحديثها" }, { status: 400 });
    }

    data.lastUpdatedBy = sessionUser.fullName;

    const existingApp = await prisma.application.findUnique({ where: { id } });
    if (!existingApp) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const changes = diffApplication(existingApp, data);

    const updated = await prisma.application.update({
      where: { id },
      data,
    });

    if (changes) {
      let action = data.status ? "STATUS_CHANGE" : "UPDATE";
      if (data.isDeleted === false) action = "RESTORE";
      if (data.isDeleted === true) action = "DELETE";

      await prisma.applicationLog.create({
        data: {
          applicationId: id,
          adminName: sessionUser.fullName,
          action,
          changes,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function GET(_request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "فشل التحميل" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  // Files written during this request, so they can be unlinked if the update fails.
  let writtenFileUrls = [];
  let isMultipart = false;

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") || "";
    let body = {};
    let invoiceFileUrl = undefined;
    let keptUrls = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // Extract basic fields
      for (const [key, value] of formData.entries()) {
        if (key !== "invoiceFiles" && key !== "existingInvoiceFileUrls") {
          body[key] = value;
        }
      }

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

      invoiceFileUrl = [...keptUrls, ...writtenFileUrls].join(",") || null;
      // if all urls were deleted, this turns into null (which is correct)
      isMultipart = true;
    } else {
      body = await request.json();
    }

    // Select only editable fields to prevent overwriting generated things
    const data = {
      status: body.status,
      name: body.name,
      newName: body.newName,
      phone: body.phone,
      phone2: body.phone2,
      nationalNumber: body.nationalNumber,
      newNationalNumber: body.newNationalNumber,
      birthDate: body.birthDate,
      addressCode: body.addressCode,
      originalAddress: body.originalAddress === "true" || body.originalAddress === true,
      originalAddressText: body.originalAddressText,
      newOriginalAddress: body.newOriginalAddress === "true" || body.newOriginalAddress === true,
      newOriginalAddressText: body.newOriginalAddressText,
      newAddressCode: body.newAddressCode,
      hasInternet: body.hasInternet,
      // Never persist an empty serviceType: a row with one matches neither panel
      // list and disappears from the UI. An empty value here means "unchanged"
      // (undefined is stripped below), so an existing classification survives.
      serviceType: body.serviceType === "" ? undefined : body.serviceType,
      contractPreference: body.contractPreference,
      selectedService: body.selectedService,
      selectedPackage: body.selectedPackage,
      noContractTechType: body.noContractTechType,
      selectedInquiry: body.selectedInquiry,
      internetCompany: body.internetCompany,
      subscriptionNo: body.subscriptionNo,
      lastInvoiceAmount: body.lastInvoiceAmount,
      address: body.address,
      newAddress: body.newAddress,
      newPhone: body.newPhone,
      note: body.note,
      adminNote: body.adminNote,
      delayedUntil: body.status === "DELAYED" && body.delayedUntil
        ? new Date(body.delayedUntil)
        : null,
      electronicApproval: body.electronicApproval === "true" || body.electronicApproval === true,
      approvalViaShipping: body.approvalViaShipping === "true" || body.approvalViaShipping === true,
      paidByUserName: body.paidByUserName === "true" || body.paidByUserName === true,
      paidByName: body.paidByName,
      discountCount: body.discountCount,
      createdBy: body.createdBy,
      lastUpdatedBy: sessionUser.fullName,
    };

    if (sessionUser.role === "ADMIN") {
      if (body.createdAt) data.createdAt = new Date(body.createdAt);
      if (body.completedAt) data.completedAt = new Date(body.completedAt);
    }

    // Auto-set completedAt when activating (unless admin explicitly provided a date above)
    if (body.status === "ACTIVATED" && !data.completedAt) {
      data.completedAt = new Date();
    }

    if (invoiceFileUrl !== undefined && contentType.includes("multipart/form-data")) {
      data.invoiceFileUrl = invoiceFileUrl;
    }

    const existingApp = await prisma.application.findUnique({ where: { id } });
    if (!existingApp) {
      // Nothing will reference the uploads we just wrote.
      await deleteInvoiceFiles(writtenFileUrls);
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    if (existingApp.adminNote !== body.adminNote && body.adminNote !== undefined) {
      data.adminNoteViewed = false;
    }

    // Remove undefined values
    Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

    const changes = diffApplication(existingApp, data);

    const updated = await prisma.application.update({
      where: { id },
      data,
    });

    if (changes) {
      let action = data.status ? "STATUS_CHANGE" : "UPDATE";
      if (data.isDeleted === false) action = "RESTORE";
      if (data.isDeleted === true) action = "DELETE";

      await prisma.applicationLog.create({
        data: {
          applicationId: id,
          adminName: sessionUser.fullName,
          action,
          changes,
        },
      });
    }

    // The row no longer references invoices the admin removed in this edit, so
    // drop them from disk. Done only after the update committed.
    if (isMultipart) {
      const removed = parseInvoiceFileUrls(existingApp.invoiceFileUrl).filter(
        (url) => !keptUrls.includes(url),
      );
      await deleteInvoiceFiles(removed);
    }

    return NextResponse.json(updated);
  } catch (error) {
    // The row kept its old invoiceFileUrl, so anything written above is unreferenced.
    await deleteInvoiceFiles(writtenFileUrls);

    if (error?.code === "INVALID_UPLOAD") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT error:", error);
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser || sessionUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح لك بالحذف" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const url = new URL(request.url);
    if (url.searchParams.get("hard") === "true") {
      const doomed = await prisma.application.findUnique({
        where: { id },
        select: { invoiceFileUrl: true },
      });
      await prisma.application.delete({ where: { id } });
      // The row is gone for good, so its uploads can never be referenced again.
      await deleteInvoiceFiles(parseInvoiceFileUrls(doomed?.invoiceFileUrl));
      return NextResponse.json({ success: true });
    }

    await prisma.application.update({
      where: { id },
      data: { isDeleted: true, lastUpdatedBy: sessionUser.fullName },
    });

    await prisma.applicationLog.create({
      data: {
        applicationId: id,
        adminName: sessionUser.fullName,
        action: "DELETE",
        changes: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "فشل حذف الطلب" }, { status: 500 });
  }
}
