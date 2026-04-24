import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";
import { formatPhoneNumber } from "@/utils/general";

const PAGE_SIZE = 20;

const VALID_STATUSES = [
  "NOT_COMPLETED",
  "NEW",
  "UNDER_REVIEW",
  "UNDER_OBSERVATION",
  "DELAYED",
  "REJECTED",
  "COMPLETED",
];

function buildWhere(searchParams) {
  const andConditions = [];

  const status = searchParams.get("status")?.trim();
  if (status && VALID_STATUSES.includes(status)) {
    andConditions.push({ status });
  }

  let dateFrom = searchParams.get("dateFrom")?.trim();
  let dateTo = searchParams.get("dateTo")?.trim();

  if (dateFrom && dateTo && dateFrom > dateTo) {
    const s = dateFrom;
    dateFrom = dateTo;
    dateTo = s;
  }

  if (dateFrom || dateTo) {
    const dateFieldParam = searchParams.get("dateField")?.trim();
    const VALID_DATE_FIELDS = [
      "createdAt",
      "completedAt",
      "delayedUntil",
      "updatedAt",
    ];

    const targetDateField = VALID_DATE_FIELDS.includes(dateFieldParam)
      ? dateFieldParam
      : "createdAt";

    const dateCondition = {};

    if (dateFrom) {
      const d = new Date(`${dateFrom}T00:00:00.000+03:00`);
      if (!Number.isNaN(d.getTime())) {
        dateCondition.gte = d;
      }
    }

    if (dateTo) {
      const d = new Date(`${dateTo}T23:59:59.999+03:00`);
      if (!Number.isNaN(d.getTime())) {
        dateCondition.lte = d;
      }
    }

    if (Object.keys(dateCondition).length) {
      andConditions.push({ [targetDateField]: dateCondition });
    }
  }

  const q = searchParams.get("q")?.trim();

  if (q) {
    const digits = q.replace(/\D/g, "");

    const orCond = [
      { name: { contains: q, mode: "insensitive" } },
      { newName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { phone2: { contains: q, mode: "insensitive" } },
      { newPhone: { contains: q, mode: "insensitive" } },
    ];

    // appIndex exact match
    if (digits.length > 0) {
      const idx = Number(digits);

      if (
        Number.isInteger(idx) &&
        idx > 0 &&
        idx <= 2147483647
      ) {
        orCond.push({ appIndex: idx });
      }
    }

    // Phone variations
    const digitPositions = [0, 3, 4, 5, 8, 9, 10, 12, 13, 15, 16];
    const templateStr = "0 (XXX) XXX XX XX";

    const variations = new Set();

    // raw digits
    variations.add(digits);

    // formatted version
    const formatted = formatPhoneNumber(digits);
    if (formatted && formatted.length > 6) {
      variations.add(formatted);
    }

    // sliding window variations
    for (let startSlot = 0; startSlot <= 11 - digits.length; startSlot++) {
      let result = "";
      let dIdx = 0;

      const startCharIdx = digitPositions[startSlot];
      const endCharIdx =
        digitPositions[startSlot + digits.length - 1];

      for (let i = startCharIdx; i <= endCharIdx; i++) {
        if (digitPositions.includes(i)) {
          result += digits[dIdx++];
        } else {
          result += templateStr[i];
        }
      }

      variations.add(result);
    }

    variations.forEach((val) => {
      if (val.length >= 3) {
        orCond.push({
          phone: { contains: val, mode: "insensitive" },
        });
        orCond.push({
          phone2: { contains: val, mode: "insensitive" },
        });
        orCond.push({
          newPhone: { contains: val, mode: "insensitive" },
        });
      }
    });

    andConditions.push({ OR: orCond });
  }

  const isDeletedParam = searchParams.get("deleted") === "true";
  andConditions.push({ isDeleted: isDeletedParam });

  if (andConditions.length === 0) return {};
  if (andConditions.length === 1) return andConditions[0];

  return { AND: andConditions };
}

export async function GET(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10) || 1,
    );
    const skip = (page - 1) * PAGE_SIZE;

    const where = buildWhere(searchParams);

    const [total, allApplications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
          },
          Review: true,
        },
      }),
    ]);

    // Custom status priority ordering
    const statusPriority = {
      NEW: 0,
      UNDER_REVIEW: 1,
      UNDER_OBSERVATION: 2,
      DELAYED: 3,
      NOT_COMPLETED: 4,
      REJECTED: 5,
      COMPLETED: 6,
    };

    // Sort by status priority first, then by creation date (newest first)
    allApplications.sort((a, b) => {
      const statusDiff =
        (statusPriority[a.status] ?? 999) - (statusPriority[b.status] ?? 999);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply pagination to sorted results
    const applications = allApplications.slice(skip, skip + PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return NextResponse.json({
      applications,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
    });
  } catch {
    return NextResponse.json({ error: "فشل تحميل الطلبات" }, { status: 500 });
  }
}

async function getNextAppIndex() {
  const latest = await prisma.application.findFirst({
    orderBy: { appIndex: "desc" },
    select: { appIndex: true },
  });
  return (latest?.appIndex ?? 0) + 1;
}

export async function POST(request) {
  const sessionUser = await isAdminAuthenticated();
  if (!sessionUser) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
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

      const newInvoiceFiles = formData.getAll("invoiceFiles[]").length > 0 ? formData.getAll("invoiceFiles[]") : formData.getAll("invoiceFiles");
      const existingUrlsStr = formData.get("existingInvoiceFileUrls") || "";
      let allUrls = existingUrlsStr.split(",").filter(Boolean);

      if (newInvoiceFiles && newInvoiceFiles.length > 0) {
        const { saveInvoiceFileLocally } = require("../../../../lib/application");
        const validNewUrls = await Promise.all(
          newInvoiceFiles
            .filter((f) => typeof f === "object" && f.size > 0)
            .map((f) => saveInvoiceFileLocally(f))
        );
        allUrls = [...allUrls, ...validNewUrls.filter(Boolean)];
      }

      invoiceFileUrl = allUrls.join(",") || null;
    } else {
      body = await request.json();
    }
    
    // Select only editable fields
    const data = {
      status: body.status || "NEW",
      name: body.name || "طلب جديد",
      phone: body.phone || "-",
      phone2: body.phone2,
      nationalNumber: body.nationalNumber,
      birthDate: body.birthDate,
      addressCode: body.addressCode,
      originalAddress: body.originalAddress === "true" || body.originalAddress === true,
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
      step: 6,
      electronicApproval: body.electronicApproval === "true" || body.electronicApproval === true,
      approvalViaShipping: body.approvalViaShipping === "true" || body.approvalViaShipping === true,
      paidByUserName: body.paidByUserName === "true" || body.paidByUserName === true,
      paidByName: body.paidByName,
      discountCount: body.discountCount,
      createdBy: body.createdBy || sessionUser.fullName,
      lastUpdatedBy: sessionUser.fullName,
    };

    if (invoiceFileUrl !== undefined) {
      data.invoiceFileUrl = invoiceFileUrl;
    }

    // Remove undefined values
    Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

    let application = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const nextAppIndex = await getNextAppIndex();
        data.appIndex = nextAppIndex;
        application = await prisma.application.create({
          data,
        });

        // Log the creation
        await prisma.applicationLog.create({
          data: {
            applicationId: application.id,
            adminName: sessionUser.fullName,
            action: "CREATE",
            changes: null,
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
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "فشل إنشاء الطلب" },
      { status: 500 }
    );
  }
}
