import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const describeReviewService = (
  serviceType = "",
  selectedService = "",
  selectedInquiry = "",
  contractPreference = "",
) => {
  if (serviceType === "newline") {
    if (contractPreference === "with")
      return "تركيب خط إنترنت جديد مع عقد إشتراك";
    if (contractPreference === "without")
      return "تركيب خط إنترنت جديد بدون عقد إشتراك";
    return "تركيب خط إنترنت جديد";
  }
  if (serviceType === "inquiry") {
    const inquiryMap = {
      pricing: "استفسار عن الأسعار والعروض",
      coverage: "استفسار عن تغطية المنطقة",
      technical: "استفسار عن مشكلة تقنية",
      general: "استفسار عام",
      "transfer-issue": "استفسار عن نقل الخط",
      "slow-speed": "استفسار عن بطء الإنترنت",
      "high-bill": "استفسار عن الفاتورة",
      "internet-down": "استفسار عن انقطاع الإنترنت",
    };
    return inquiryMap[selectedInquiry] || "استشارات";
  }
  if (serviceType === "services") {
    const serviceMap = {
      cancel: "خدمة إلغاء الإشتراك",
      "transfer-name": "خدمة نقل ملكية الإشتراك",
      "transfer-address": "خدمة نقل خط الإنترنت لعنوان آخر",
      renew: "خدمة تجديد الإشتراك",
      freeze: "خدمة تجميد الإشتراك",
      "change-phone": "خدمة تغيير رقم الموبايل",
      shurn: "خدمة تحويل الإشتراك إلى Göknet",
      "shurn-turknet": "خدمة تحويل الإشتراك إلى Turknet",
    };
    return serviceMap[selectedService] || "خدمة تقنية";
  }
  return "خدمة الإنترنت";
};

const reviews = await prisma.review.findMany({
  where: {
    applicationId: { not: null },
  },
  include: {
    Application: {
      select: {
        serviceType: true,
        selectedService: true,
        selectedInquiry: true,
        contractPreference: true,
      },
    },
  },
});

console.log(`Found ${reviews.length} review(s) to backfill.`);

let updated = 0;
let skipped = 0;

await prisma.$transaction(
  reviews
    .map((review) => {
      const app = review.Application;
      if (!app) {
        skipped++;
        return null;
      }
      const service = describeReviewService(
        app.serviceType,
        app.selectedService,
        app.selectedInquiry,
        app.contractPreference,
      );
      updated++;
      return prisma.review.update({
        where: { id: review.id },
        data: { service },
      });
    })
    .filter(Boolean),
);

console.log(`Updated: ${updated} · Skipped (no linked application): ${skipped}`);

await prisma.$disconnect();
