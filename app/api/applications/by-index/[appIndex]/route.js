import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const applicationSelect = {
  id: true,
  appIndex: true,
  status: true,
  step: true,
  name: true,
  newName: true,
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
  lastInvoiceAmount: true,
  selectedInquiry: true,
  internetCompany: true,
  addressCode: true,
  newAddressCode: true,
  originalAddress: true,
  originalAddressText: true,
  newOriginalAddress: true,
  newOriginalAddressText: true,
  newAddress: true,
  newPhone: true,
  adminNote: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const raw = resolvedParams?.appIndex;
    const appIndex = Number(raw);

    if (!Number.isInteger(appIndex) || appIndex < 1) {
      return NextResponse.json(
        { error: "رقم الطلب غير صالح." },
        { status: 400 },
      );
    }

    const application = await prisma.application.findUnique({
      where: { appIndex },
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

