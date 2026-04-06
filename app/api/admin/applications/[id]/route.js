import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../../lib/admin-api";

const ALLOWED_STATUSES = [
  "NOT_COMPLETED",
  "NEW",
  "UNDER_REVIEW",
  "UNDER_OBSERVATION",
  "DELAYED",
  "REJECTED",
  "COMPLETED",
];

export async function PATCH(request, { params }) {
  if (!(await isAdminAuthenticated())) {
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

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "حالة غير صالحة." },
          { status: 400 },
        );
      }
      data.status = body.status;
      if (body.status === "COMPLETED") {
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
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "لا يوجد بيانات لتحديثها" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
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
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") || "";
    let body = {};
    let invoiceFileUrl = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // Extract basic fields
      for (const [key, value] of formData.entries()) {
        if (key !== "invoiceFiles" && key !== "existingInvoiceFileUrls") {
          body[key] = value;
        }
      }

      const newInvoiceFiles = formData.getAll("invoiceFiles");
      const existingUrlsStr = formData.get("existingInvoiceFileUrls") || "";
      let allUrls = existingUrlsStr.split(",").filter(Boolean);

      if (newInvoiceFiles && newInvoiceFiles.length > 0) {
        // we need to dynamically import or require saveInvoiceFileLocally
        const { saveInvoiceFileLocally } = require("../../../../../lib/application");
        const validNewUrls = await Promise.all(
          newInvoiceFiles
            .filter((f) => typeof f === "object" && f.size > 0)
            .map((f) => saveInvoiceFileLocally(f))
        );
        allUrls = [...allUrls, ...validNewUrls.filter(Boolean)];
      }

      invoiceFileUrl = allUrls.join(",") || null;
      // if all urls were deleted, this turns into null (which is correct)
    } else {
      body = await request.json();
    }
    
    // Select only editable fields to prevent overwriting generated things
    const data = {
      status: body.status,
      name: body.name,
      phone: body.phone,
      phone2: body.phone2,
      nationalNumber: body.nationalNumber,
      birthDate: body.birthDate,
      addressCode: body.addressCode,
      originalAddress: body.originalAddress === "true" || body.originalAddress === true,
      originalAddressText: body.originalAddressText,
      hasInternet: body.hasInternet,
      serviceType: body.serviceType,
      contractPreference: body.contractPreference,
      selectedService: body.selectedService,
      selectedPackage: body.selectedPackage,
      noContractTechType: body.noContractTechType,
      selectedInquiry: body.selectedInquiry,
      internetCompany: body.internetCompany,
      subscriptionNo: body.subscriptionNo,
      address: body.address,
      note: body.note,
      adminNote: body.adminNote,
      delayedUntil: body.status === "DELAYED" && body.delayedUntil
        ? new Date(body.delayedUntil)
        : null,
    };

    if (invoiceFileUrl !== undefined && contentType.includes("multipart/form-data")) {
      data.invoiceFileUrl = invoiceFileUrl;
    }

    // Remove undefined values
    Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

    const updated = await prisma.application.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "فشل حذف الطلب" }, { status: 500 });
  }
}
