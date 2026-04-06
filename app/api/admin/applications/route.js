import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

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
    const VALID_DATE_FIELDS = ["createdAt", "completedAt", "delayedUntil"];
    const targetDateField = VALID_DATE_FIELDS.includes(dateFieldParam) ? dateFieldParam : "createdAt";

    const dateCondition = {};
    if (dateFrom) {
      const d = new Date(`${dateFrom}T00:00:00.000Z`);
      if (!Number.isNaN(d.getTime())) dateCondition.gte = d;
    }
    if (dateTo) {
      const d = new Date(`${dateTo}T23:59:59.999Z`);
      if (!Number.isNaN(d.getTime())) dateCondition.lte = d;
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
      { phone: { contains: q, mode: "insensitive" } },
    ];
    // `appIndex` is an integer, so we can only do an exact match here.
    if (digits.length > 0) {
      const idx = Number(digits);
      if (Number.isInteger(idx) && idx > 0) {
        orCond.push({ appIndex: idx });
      }
    }
    if (digits.length >= 3) orCond.push({ phone: { contains: digits } });
    andConditions.push({ OR: orCond });
  }

  andConditions.push({ isDeleted: false });

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
  if (!(await isAdminAuthenticated())) {
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

      const newInvoiceFiles = formData.getAll("invoiceFiles");
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
          select: {
            id: true,
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
