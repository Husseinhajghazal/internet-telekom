import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import {
  normalizeNameForMatch,
  normalizePhoneForMatch,
} from "../../../../lib/application";

const applicationSelect = {
  id: true,
  appIndex: true,
  status: true,
  step: true,
  name: true,
  phone: true,
  hasInternet: true,
  serviceType: true,
  contractPreference: true,
  selectedService: true,
  selectedPackage: true,
  address: true,
  note: true,
  invoiceFileUrl: true,
  createdAt: true,
  updatedAt: true,
};

async function findMatchesByNameAndPhone(name, phone) {
  const nName = normalizeNameForMatch(name);
  const nPhone = normalizePhoneForMatch(phone);
  if (!nName || nPhone.length < 12) {
    return [];
  }

  /** Exact match on normalized digits + name (case-insensitive trim). */
  const rows = await prisma.$queryRaw`
    SELECT
      "id",
      "appIndex",
      "status",
      "step",
      "name",
      "phone",
      "hasInternet",
      "serviceType",
      "contractPreference",
      "selectedService",
      "selectedPackage",
      "address",
      "note",
      "invoiceFileUrl",
      "createdAt",
      "updatedAt"
    FROM "Application"
    WHERE "phone" = ${nPhone}
    AND lower(trim("name")) = lower(trim(${nName}))
    ORDER BY "updatedAt" DESC
  `;

  return Array.isArray(rows) ? rows : [];
}

async function getNextAppIndex() {
  const latest = await prisma.application.findFirst({
    orderBy: { appIndex: "desc" },
    select: { appIndex: true },
  });
  return (latest?.appIndex ?? 0) + 1;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const phone = body?.phone?.trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "الاسم ورقم الهاتف مطلوبان." },
        { status: 400 },
      );
    }

    const matches = await findMatchesByNameAndPhone(name, phone);

    const notCompleted = matches.find((m) => m.status === "NOT_COMPLETED");
    if (notCompleted) {
      return NextResponse.json({
        action: "resume",
        application: notCompleted,
      });
    }

    const underReview = matches.find((m) => m.status === "UNDER_REVIEW");
    if (underReview) {
      return NextResponse.json({
        action: "redirect",
        appIndex: underReview.appIndex,
      });
    }

    let application = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const nextAppIndex = await getNextAppIndex();
        application = await prisma.application.create({
          data: {
            appIndex: nextAppIndex,
            name,
            phone,
            status: "NOT_COMPLETED",
            step: 1,
          },
          select: applicationSelect,
        });
        break;
      } catch (error) {
        if (error?.code !== "P2002" || attempt === 4) {
          throw error;
        }
      }
    }

    return NextResponse.json(
      {
        action: "created",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "فشل بدء الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
