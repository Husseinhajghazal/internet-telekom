import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";
import { formatPhoneNumber } from "@/utils/general";

const PAGE_SIZE = 20;

function getPackageDurationMonths(selectedPackage) {
  if (!selectedPackage) return null;
  const parts = selectedPackage.split("-");
  if (parts.length < 2) return null;
  const months = parseInt(parts[1], 10);
  return isNaN(months) ? null : months;
}

const VALID_STATUSES = [
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
];

const ADDED_VIEW_STATUSES = ["NOT_COMPLETED", "COMPLETED"];

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

  const internetCompanyParam = searchParams.get("internetCompany")?.trim();
  if (internetCompanyParam) {
    andConditions.push({
      internetCompany: { contains: internetCompanyParam, mode: "insensitive" },
    });
  }

  const selectedServiceParam = searchParams.get("selectedService")?.trim();
  if (selectedServiceParam) {
    andConditions.push({ selectedService: selectedServiceParam });
  }

  const topTypeParam = searchParams.get("topType")?.trim();
  if (topTypeParam === "newline") {
    andConditions.push({ serviceType: "newline" });
  } else if (topTypeParam === "switch") {
    andConditions.push({
      serviceType: "services",
      selectedService: { in: ["upgrade", "shurn"] },
    });
  } else if (topTypeParam === "services") {
    andConditions.push({
      serviceType: "services",
      selectedService: { notIn: ["upgrade", "shurn"] },
    });
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
      { nationalNumber: { contains: q, mode: "insensitive" } },
      { newNationalNumber: { contains: q, mode: "insensitive" } },
    ];

    // appIndex exact match
    if (digits.length > 0) {
      const idx = Number(digits);

      if (Number.isInteger(idx) && idx > 0 && idx <= 2147483647) {
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
      const endCharIdx = digitPositions[startSlot + digits.length - 1];

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

  const serviceTypeParam = searchParams.get("serviceType");
  if (serviceTypeParam === "internet") {
    andConditions.push({
      OR: [
        { serviceType: "newline" },
        { serviceType: "services", selectedService: "upgrade" },
        { serviceType: "services", selectedService: "shurn" },
      ],
    });
  } else if (serviceTypeParam === "services") {
    andConditions.push({
      OR: [
        { serviceType: "inquiry" },
        { serviceType: "services", selectedService: { notIn: ["upgrade", "shurn"] } },
      ],
    });
  }

  // Split between the main /panel list and the new /panel/added list.
  // Deleted view ignores `view` and shows every soft-deleted row regardless of status.
  if (!isDeletedParam) {
    const view = searchParams.get("view") === "added" ? "added" : "main";
    if (view === "added") {
      andConditions.push({ status: { in: ADDED_VIEW_STATUSES } });
    } else {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      andConditions.push({
        OR: [
          { status: { notIn: [...ADDED_VIEW_STATUSES, "DELAYED"] } },
          {
            status: "DELAYED",
            OR: [{ delayedUntil: null }, { delayedUntil: { gt: todayEnd } }],
          },
        ],
      });
    }
  }

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

    const view = searchParams.get("view");

    if (view === "expiring") {
      const q = searchParams.get("q")?.trim();
      const now = new Date();
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      const twoMonthsFromNow = new Date(now);
      twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

      let searchAnd = [];
      if (q) {
        const digits = q.replace(/\D/g, "");
        const orCond = [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { phone2: { contains: q, mode: "insensitive" } },
          { newPhone: { contains: q, mode: "insensitive" } },
          { nationalNumber: { contains: q, mode: "insensitive" } },
        ];
        if (digits.length > 0) {
          const idx = Number(digits);
          if (Number.isInteger(idx) && idx > 0 && idx <= 2147483647)
            orCond.push({ appIndex: idx });
        }
        searchAnd.push({ OR: orCond });
      }

      const topTypeParam = searchParams.get("topType")?.trim();
      if (topTypeParam === "newline") {
        searchAnd.push({ serviceType: "newline" });
      } else if (topTypeParam === "switch") {
        searchAnd.push({
          serviceType: "services",
          selectedService: { in: ["upgrade", "shurn"] },
        });
      } else if (topTypeParam === "services") {
        searchAnd.push({
          serviceType: "services",
          selectedService: { notIn: ["upgrade", "shurn"] },
        });
      }

      const [allActivated, dueDelayed] = await Promise.all([
        prisma.application.findMany({
          where: { isDeleted: false, status: "ACTIVATED", AND: searchAnd },
          include: { notes: { orderBy: { createdAt: "desc" } }, Review: true },
        }),
        prisma.application.findMany({
          where: {
            isDeleted: false,
            status: "DELAYED",
            delayedUntil: { not: null, lte: todayEnd },
            AND: searchAnd,
          },
          include: { notes: { orderBy: { createdAt: "desc" } }, Review: true },
        }),
      ]);

      const expiring = allActivated
        .map((app) => {
          const durationMonths = getPackageDurationMonths(app.selectedPackage);
          if (!durationMonths || !app.completedAt) return null;
          const expiresAt = new Date(app.completedAt);
          expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
          return { ...app, expiresAt };
        })
        .filter(Boolean)
        .filter(
          (app) => app.expiresAt >= now && app.expiresAt <= twoMonthsFromNow,
        )
        .sort((a, b) => a.expiresAt - b.expiresAt);

      // Due-delayed apps appear first, sorted by how overdue they are (oldest first)
      const dueDelayedMapped = dueDelayed
        .sort((a, b) => new Date(a.delayedUntil) - new Date(b.delayedUntil))
        .map((app) => ({ ...app, expiresAt: new Date(app.delayedUntil) }));

      const combined = [...dueDelayedMapped, ...expiring];
      const total = combined.length;
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const paginated = combined.slice(skip, skip + PAGE_SIZE).map((app) => ({
        ...app,
        expiresAt: app.expiresAt instanceof Date ? app.expiresAt.toISOString() : app.expiresAt,
      }));
      return NextResponse.json({
        applications: paginated,
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages,
      });
    }

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

    allApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

      const newInvoiceFiles =
        formData.getAll("invoiceFiles[]").length > 0
          ? formData.getAll("invoiceFiles[]")
          : formData.getAll("invoiceFiles");
      const existingUrlsStr = formData.get("existingInvoiceFileUrls") || "";
      let allUrls = existingUrlsStr.split(",").filter(Boolean);

      if (newInvoiceFiles && newInvoiceFiles.length > 0) {
        const {
          saveInvoiceFileLocally,
        } = require("../../../../lib/application");
        const validNewUrls = await Promise.all(
          newInvoiceFiles
            .filter((f) => typeof f === "object" && f.size > 0)
            .map((f) => saveInvoiceFileLocally(f)),
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
      originalAddress:
        body.originalAddress === "true" || body.originalAddress === true,
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
      delayedUntil:
        body.status === "DELAYED" && body.delayedUntil
          ? new Date(body.delayedUntil)
          : null,
      step: 6,
      electronicApproval:
        body.electronicApproval === "true" || body.electronicApproval === true,
      approvalViaShipping:
        body.approvalViaShipping === "true" ||
        body.approvalViaShipping === true,
      paidByUserName:
        body.paidByUserName === "true" || body.paidByUserName === true,
      paidByName: body.paidByName,
      discountCount: body.discountCount,
      createdBy: body.createdBy || sessionUser.fullName,
      lastUpdatedBy: sessionUser.fullName,
    };

    if (invoiceFileUrl !== undefined) {
      data.invoiceFileUrl = invoiceFileUrl;
    }

    // Remove undefined values
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

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
    return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}
