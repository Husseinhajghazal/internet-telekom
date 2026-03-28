import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { formatPhoneNumber } from "@/utils/general";

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
  noContractTechType: true,
  subscriptionNo: true,
  selectedInquiry: true,
  internetCompany: true,
  adminNote: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const phoneInput = resolvedParams?.phone?.trim();

    if (!phoneInput || phoneInput.length < 7) {
      return NextResponse.json(
        { error: "رقم الموبايل غير صالح." },
        { status: 400 },
      );
    }

    // Format the input to match the stored display format
    const formattedPhone = formatPhoneNumber(phoneInput);

    // Get the newest application for this phone
    const application = await prisma.application.findFirst({
      where: { phone: formattedPhone },
      select: applicationSelect,
      orderBy: { createdAt: "desc" },
    });

    if (!application) {
      return NextResponse.json(
        { error: "لا توجد طلبات لهذا الرقم." },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "فشل تحميل الطلب، يرجى المحاولة مرة أخرى." },
      { status: 500 },
    );
  }
}
