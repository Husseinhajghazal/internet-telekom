import {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  describeNoContractTechType,
  describeStatus
} from "../utils/general";

function describeHasInternet(value) {
  if (value === "yes") return "نعم";
  if (value === "no") return "لا";
  return "—";
}

/**
 * @param {import("@prisma/client").Application} app
 */
export function buildApplicationWhatsAppMessageAr(app) {
  const serviceType = app.serviceType || "";

  let contractLine = "—";
  let serviceLine = "—";
  let packageLine = "—";

  if (serviceType === "newline") {
    contractLine = describeContractPreference(app.contractPreference);
    if (app.contractPreference === "with") {
      packageLine = describeSelectedPackage(app.selectedPackage);
    }
  } else if (serviceType === "services") {
    serviceLine = describeSelectedService(app.selectedService);
  }

  const lines = [
    "*طلب جديد — إنترنت تيليكوم*",
    "",
    `رمز الطلب: ${app.appIndex ?? "—"}`,
    `الحالة: ${describeStatus(app.status)}`,
    `الإسم: ${app.name || "—"}`,
    `الموبايل: ${app.phone || "—"}`,
    `هل لديه إنترنت: ${describeHasInternet(app.hasInternet)}`,
    `نوع الطلب: ${describeServiceType(serviceType)}`,
    `نوع العرض: ${contractLine}`,
    `الخدمة المختارة: ${serviceLine}`,
    `الباقة: ${packageLine}`,
    `نوع التقنية: ${describeNoContractTechType(app.noContractTechType) || "—"}`,
    `رقم الإشتراك: ${app.subscriptionNo || "—"}`,
    `نوع الاستشارة: ${describeSelectedInquiry(app.selectedInquiry) || "—"}`,
    `شركة الإنترنت: ${app.internetCompany || "—"}`,
    "",
    `العنوان: ${(app.address || "").trim() || "—" }`,
    `ملاحظة: ${(app.note || "").trim() || "—"}`,
    `رابط صورة الفاتورة: ${(app.invoiceFileUrl || "").trim() || "—"}`,
  ];

  return lines.join("\n");
}
