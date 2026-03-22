import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

const PAGE_SIZE = 20;

const VALID_STATUSES = [
  "NOT_COMPLETED",
  "UNDER_REVIEW",
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
    const createdAt = {};
    if (dateFrom) {
      const d = new Date(`${dateFrom}T00:00:00.000Z`);
      if (!Number.isNaN(d.getTime())) createdAt.gte = d;
    }
    if (dateTo) {
      const d = new Date(`${dateTo}T23:59:59.999Z`);
      if (!Number.isNaN(d.getTime())) createdAt.lte = d;
    }
    if (Object.keys(createdAt).length) {
      andConditions.push({ createdAt });
    }
  }

  const q = searchParams.get("q")?.trim();
  if (q) {
    const codePart = q.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    const digits = q.replace(/\D/g, "");
    const orCond = [
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
    if (codePart.length > 0) {
      orCond.push({ appCode: { contains: codePart, mode: "insensitive" } });
    }
    if (digits.length >= 3) {
      orCond.push({ phone: { contains: digits } });
    }
    andConditions.push({ OR: orCond });
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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const skip = (page - 1) * PAGE_SIZE;

    const where = buildWhere(searchParams);

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
    ]);

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
