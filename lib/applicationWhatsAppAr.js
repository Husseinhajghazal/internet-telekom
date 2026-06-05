import {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  describeNoContractTechType,
  describeSelectedInquiry,
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
  const selectedService = app.selectedService || "";

  // Extra fields are only collected for specific services.
  const showNewName = selectedService === "transfer-name";
  const showNewPhone =
    selectedService === "transfer-name" || selectedService === "change-phone";
  const showNewAddress = selectedService === "transfer-address";

  const address = (app.address || "").trim();
  const newAddress = (app.newAddress || "").trim();
  const note = (app.note || "").trim();

  // Each line is included only when it has a real value.
  const fields = [
    app.appIndex != null && `رقم الطلب: ${app.appIndex}`,
    app.name && `الإسم: ${app.name}`,
    showNewName && app.newName && `إسم المالك الجديد: ${app.newName}`,
    app.phone && `الموبايل: ${app.phone}`,
    showNewPhone && app.newPhone && `رقم الموبايل الجديد: ${app.newPhone}`,
    (app.hasInternet === "yes" || app.hasInternet === "no") &&
      `هل لديه إنترنت: ${describeHasInternet(app.hasInternet)}`,
    serviceType && `نوع الطلب: ${describeServiceType(serviceType)}`,
    serviceType === "newline" &&
      app.contractPreference &&
      `نوع العقد: ${describeContractPreference(app.contractPreference)}`,
    serviceType === "services" &&
      selectedService &&
      `الخدمة المختارة: ${describeSelectedService(selectedService)}`,
    serviceType === "newline" &&
      app.contractPreference === "with" &&
      app.selectedPackage &&
      `الباقة: ${describeSelectedPackage(app.selectedPackage)}`,
    app.noContractTechType &&
      `نوع التقنية: ${describeNoContractTechType(app.noContractTechType)}`,
    app.subscriptionNo && `رقم الإشتراك: ${app.subscriptionNo}`,
    app.selectedInquiry &&
      `نوع الاستشارة: ${describeSelectedInquiry(app.selectedInquiry)}`,
    app.internetCompany && `شركة الإنترنت: ${app.internetCompany}`,
    address && `العنوان: ${address}`,
    showNewAddress && newAddress && `العنوان الجديد: ${newAddress}`,
    note && `ملاحظة: ${note}`,
  ].filter(Boolean);

  return [
    "السلام عليكم فريق إنترنت تيليكوم, هذه تفاصيل طلبي:",
    "",
    ...fields,
  ].join("\n");
}
