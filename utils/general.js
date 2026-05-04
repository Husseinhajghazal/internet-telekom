import moment from "moment";
import { STATUS_LABELS } from "./data";

const describeServiceType = (serviceType = "") => {
  if (serviceType === "newline") return "خط جديد";
  if (serviceType === "services") return "خدمات";
  if (serviceType === "inquiry") return "استشارات";
  return serviceType || "—";
};

const describeSelectedInquiry = (selectedInquiry = "") => {
  const map = {
    pricing: "استفسار عن الأسعار والعروض",
    coverage: "استفسار عن تغطية المنطقة",
    technical: "استفسار عن مشكلة تقنية",
    general: "استفسار عام",
    "transfer-issue": "نقل الخط - لا يمكنني النقل لعنواني الجديد",
    "slow-speed": "سرعة الخط - بطئ شديد في السرعة",
    "high-bill": "الفاتورة مرتفعة - فاتورة غير منتظمة وعشوائية",
    "internet-down": "الإنترنت متوقف - خط متوقف ولا يعمل",
  };
  return map[selectedInquiry] || selectedInquiry || "—";
};

const describeContractPreference = (contractPreference = "") => {
  if (contractPreference === "with") return "مع عقد إشتراك";
  if (contractPreference === "without") return "بدون عقد إشتراك";
  return contractPreference || "—";
};

const describeNoContractTechType = (techType = "") => {
  const map = {
    vdsl: "VDSL",
    fiber: "Fiber",
    gigafiber: "GigaFiber",
  };
  return map[techType] || techType || "—";
};

const describeSelectedService = (selectedService = "") => {
  const map = {
    cancel: "إلغاء الاشتراك",
    "transfer-name": "نقل ملكية",
    "transfer-address": "نقل خط الإنترنت لعنوان آخر",
    renew: "تجديد الاشتراك",
    freeze: "تجميد الاشتراك",
    upgrade: "تحويل من عقد لبدون عقد",
    "change-phone": "تغيير رقم الموبايل المثبت",
  };
  return map[selectedService] || selectedService || "—";
};

const describeSelectedPackage = (selectedPackage = "") => {
  if (!selectedPackage) return "—";
  const noContractMatch = selectedPackage.match(/^no-contract-(.+)$/);
  if (noContractMatch) {
    const speed = noContractMatch[1];
    return `بدون عقد إشتراك • ${speed} ميغابت/ثانية`;
  }

  const match = selectedPackage.match(/^(family|vip)-(\d+)-(.+)$/);
  if (!match) return selectedPackage;
  const [, kind, duration, speed] = match;
  const kindLabel = kind === "family" ? "عائلية" : "VIP";
  const durationLabel =
    duration === "12"
      ? "سنة"
      : duration === "18"
        ? "18 شهر"
        : duration === "24"
          ? "سنتين"
          : `${duration} شهر`;
  return `${kindLabel} • ميغابت/ثانية ${speed} • ${durationLabel}`;
};

const formatPhoneNumber = (value = "") => {
  let formatted = value.replace(/\D/g, "");

  // Remove country code (90)
  if (formatted.startsWith("90")) {
    formatted = formatted.substring(2);
  }

  // Remove leading 0
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1);
  }

  // 🚀 Force first digit to be 5 (mobile numbers in TR)
  if (!formatted.startsWith("5")) {
    formatted = "5" + formatted.substring(1);
  }

  // Limit to 10 digits (5XXXXXXXXX)
  formatted = formatted.substring(0, 10);

  let display = "0";

  if (formatted.length > 0) {
    display += ` (${formatted.substring(0, 3)}`;
  }
  if (formatted.length > 3) {
    display += `) ${formatted.substring(3, 6)}`;
  }
  if (formatted.length > 6) {
    display += ` ${formatted.substring(6, 8)}`;
  }
  if (formatted.length > 8) {
    display += ` ${formatted.substring(8, 10)}`;
  }

  return display;
};

const formatBirthDate = (value = "") => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 8) digits = digits.substring(0, 8);

  let formatted = "";
  if (digits.length > 0) {
    formatted = digits.substring(0, 2);
  }
  if (digits.length > 2) {
    formatted += "/" + digits.substring(2, 4);
  }
  if (digits.length > 4) {
    formatted += "/" + digits.substring(4, 8);
  }
  return formatted;
};

const validateTC = (tc) => {
  if (!tc || typeof tc !== "string") return false;
  const digits = tc.replace(/\D/g, "");
  if (digits.length !== 11 || digits.startsWith("0")) return false;

  const n = digits.split("").map((d) => parseInt(d, 10));

  // sum of 1, 3, 5, 7, 9
  const sumOdd = n[0] + n[2] + n[4] + n[6] + n[8];
  // sum of 2, 4, 6, 8
  const sumEven = n[1] + n[3] + n[5] + n[7];

  const term1 = sumOdd * 7;
  const term2 = sumEven;
  const digit10 = (term1 - term2) % 10;
  // Handle negative remainder
  const finalDigit10 = (digit10 + 10) % 10;
  if (finalDigit10 !== n[9]) return false;

  const sumFirst10 = (sumOdd + sumEven + n[9]);
  if (sumFirst10 % 10 !== n[10]) return false;

  return true;
};

const getStepFieldOrder = (step, values) => {
  if (step === 1) return ["name", "phone", "userAgreementAccepted"];
  if (step === 2) return ["hasInternet"];
  if (step === 3) return ["serviceType"];
  if (step === 4) {
    if (
      values?.serviceType === "services" &&
      values?.selectedService === "upgrade"
    )
      return [];
    if (values?.serviceType === "services") return ["selectedService"];
    if (values?.serviceType === "newline") return ["contractPreference"];
    if (values?.serviceType === "inquiry") return ["selectedInquiry"];
    return ["contractPreference", "selectedService"];
  }
  if (step === 5) {
    if (values?.contractPreference === "with") return ["selectedPackage"];
    return [];
  }
  if (step === 6) {
    if (values?.serviceType === "inquiry") return [];
    if (values?.serviceType === "services" || values?.serviceType === "upgrade")
      return ["internetCompany", "address"];
    return ["address"];
  }
  return [];
};

const getNextStep = (step, values) => {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) {
    if (
      values.serviceType === "services" &&
      values.selectedService === "upgrade"
    )
      return 5;
    return 4;
  }
  if (step === 4) {
    if (values.serviceType === "services") return 6;
    if (values.serviceType === "inquiry") return 6;
    if (values.serviceType === "newline") {
      return 5;
    }
  }
  if (step === 5) return 6;
  return step;
};

const getPreviousStep = (step, values) => {
  if (step === 1) return 1;
  if (step === 2) return 1;
  if (step === 3) return 2;
  if (step === 4) return 3;
  if (step === 5) {
    if (
      values.serviceType === "services" &&
      values.selectedService === "upgrade"
    )
      return 3;
    return 4;
  }
  if (step === 6) {
    if (
      values.serviceType === "services" &&
      values.selectedService === "upgrade"
    ) {
      return 5;
    }
    if (values.serviceType === "services") return 4;
    if (values.serviceType === "newline") {
      return 5;
    }
    if (values.serviceType === "inquiry") return 4;
  }
  return step;
};

/** Derive family/vip contract duration strings from selectedPackage (client-safe). */
const parsePackageDurations = (selectedPackage) => {
  if (!selectedPackage || typeof selectedPackage !== "string") {
    return { family: null, vip: null };
  }
  const familyMatch = selectedPackage.match(/^family-(\d+)-/);
  const vipMatch = selectedPackage.match(/^vip-(\d+)-/);
  return {
    family: familyMatch ? familyMatch[1] : null,
    vip: vipMatch ? vipMatch[1] : null,
  };
};

const maskValue = (
  value = "",
  visiblePrefix = 3,
  visibleSuffix = 0,
  maskChar = "*",
) => {
  const str = String(value || "");
  if (!str) return "—";
  if (str.length <= visiblePrefix + visibleSuffix) return str;
  const maskedLength = str.length - visiblePrefix - visibleSuffix;
  return (
    str.slice(0, visiblePrefix) +
    maskChar.repeat(maskedLength) +
    (visibleSuffix > 0 ? str.slice(-visibleSuffix) : "")
  );
};

const maskPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "—";
  return maskValue(digits);
};

const maskName = (name = "") => {
  if (!name) return "—";
  return maskValue(name.trim());
};

const maskAddress = (address = "") => {
  if (!address) return "—";

  return address
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      return maskValue(trimmed);
    })
    .join(", ");
};

function formatDate(date, type = "2") {
  if (!date) return "—";
  // Turkey is UTC+3. Since Turkey doesn't use DST, we can hard-offset it.
  const curDate = moment.utc(date).utcOffset(3);
  let dt;
  if (type == "1") {
    dt = curDate.format("DD.MM.YYYY");
  } else if (type == "2") {
    dt = curDate.format("YYYY-MM-DD HH:mm");
  } else if (type == "3") {
    dt = curDate.format("YYYY-MM-DD  HH:mm:ss.000");
  } else if (type == "4") {
    dt = curDate.format("YYYY-MM-DD");
  } else if (type == "5") {
    dt = curDate.format("HH:mm");
  }
  return dt;
}

const normalizeIndex = (value) => String(value || "").replace(/\D/g, "");

function describeStatus(status) {
  return STATUS_LABELS[status] || status || "—";
}

const statusBadgeClass = (status) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 ring-1 ring-blue-200/60";
    case "COMPLETED":
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-200/60";
    case "ACTIVATED":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/60";
    case "REJECTED":
      return "bg-red-100 text-red-800 ring-1 ring-red-200/60";
    case "UNDER_REVIEW":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200/60";
    case "UNDER_OBSERVATION":
      return "bg-purple-100 text-purple-900 ring-1 ring-purple-200/60";
    case "DELAYED":
      return "bg-orange-100 text-orange-900 ring-1 ring-orange-200/60";
    case "NOT_COMPLETED":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/60";
    case "TECHNICAL_PROBLEM":
      return "bg-rose-100 text-rose-900 ring-1 ring-rose-200/60";
    case "TRYING_TO_PERSUADE":
      return "bg-fuchsia-100 text-fuchsia-900 ring-1 ring-fuchsia-200/60";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const compressImage = async (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      resolve(file); // Don't compress non-images or GIFs
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file); // fallback
    };
    reader.onerror = () => resolve(file); // fallback
  });
};

  export {
  describeContractPreference,
  describeNoContractTechType,
  describeSelectedInquiry,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  formatPhoneNumber,
  formatBirthDate,
  validateTC,
  getNextStep,
  getPreviousStep,
  getStepFieldOrder,
  parsePackageDurations,
  maskValue,
  maskPhone,
  maskName,
  maskAddress,
  formatDate,
  normalizeIndex,
  describeStatus,
  statusBadgeClass,
  compressImage
};
