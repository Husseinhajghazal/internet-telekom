import {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
} from "../utils/general";

const STATUS_LABELS = {
  NOT_COMPLETED: "غير مكتمل",
  UNDER_REVIEW: "قيد المراجعة",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

function describeHasInternet(value) {
  if (value === "yes") return "نعم";
  if (value === "no") return "لا";
  return "—";
}

function describeStatus(status) {
  return STATUS_LABELS[status] || status || "—";
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
    `رمز الطلب: ${app.appCode || "—"}`,
    `الحالة: ${describeStatus(app.status)}`,
    `الاسم: ${app.name || "—"}`,
    `الهاتف: ${app.phone || "—"}`,
    `هل لديه إنترنت: ${describeHasInternet(app.hasInternet)}`,
    `نوع الطلب: ${describeServiceType(serviceType)}`,
    `نوع العروض: ${contractLine}`,
    `الخدمة المختارة: ${serviceLine}`,
    `الباقة: ${packageLine}`,
    "",
    `العنوان: ${(app.address || "").trim() || "—"}`,
    `ملاحظة: ${(app.note || "").trim() || "—"}`,
    `رابط صورة الفاتورة: ${(app.invoiceFileUrl || "").trim() || "—"}`,
  ];

  return lines.join("\n");
}
