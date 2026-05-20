import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { isAdminAuthenticated } from "../../../../lib/admin-api";

function getPackageDurationMonths(selectedPackage) {
  if (!selectedPackage) return null;
  const parts = selectedPackage.split("-");
  if (parts.length < 2) return null;
  const months = parseInt(parts[1], 10);
  return isNaN(months) ? null : months;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const twoMonthsFromNow = new Date(now);
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    // Pre-filter: contracts activated within the last 25 months can still be expiring
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - 25);

    const [activatedApps, dueDelayedCount] = await Promise.all([
      prisma.application.findMany({
        where: {
          isDeleted: false,
          status: "ACTIVATED",
          completedAt: { not: null, gte: cutoff },
          selectedPackage: { not: null },
        },
        select: { completedAt: true, selectedPackage: true },
      }),
      prisma.application.count({
        where: {
          isDeleted: false,
          status: "DELAYED",
          delayedUntil: { not: null, lte: todayEnd },
        },
      }),
    ]);

    const expiringCount = activatedApps.filter((app) => {
      const durationMonths = getPackageDurationMonths(app.selectedPackage);
      if (!durationMonths) return false;
      const expiresAt = new Date(app.completedAt);
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
      return expiresAt >= now && expiresAt <= twoMonthsFromNow;
    }).length;

    return NextResponse.json({ count: expiringCount + dueDelayedCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطأ" }, { status: 500 });
  }
}
