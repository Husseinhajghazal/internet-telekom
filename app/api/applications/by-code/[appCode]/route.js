import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const applicationSelect = {
  id: true,
  appCode: true,
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

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const appCode = resolvedParams?.appCode?.trim()?.toUpperCase();
    if (!appCode || appCode.length !== 6) {
      return NextResponse.json({ error: "رمز الطلب غير صالح." }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { appCode },
      select: applicationSelect,
    });

    if (!application) {
      return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "فشل تحميل الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
