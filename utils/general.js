const describeServiceType = (serviceType = "") => {
  if (serviceType === "newline") return "خط جديد";
  if (serviceType === "services") return "خدمات";
  if (serviceType === "inquiry") return "استعلام";
  return serviceType || "—";
};

const describeContractPreference = (contractPreference = "") => {
  if (contractPreference === "with") return "مع عقد";
  if (contractPreference === "without") return "بدون عقد";
  return contractPreference || "—";
};

const describeSelectedService = (selectedService = "") => {
  const map = {
    cancel: "إلغاء الاشتراك",
    "transfer-name": "نقل ملكية (تغيير الاسم)",
    "transfer-address": "نقل خط (تغيير العنوان)",
    renew: "تجديد الاشتراك",
    freeze: "تجميد الاشتراك",
    upgrade: "تحديث الخدمة الحالية",
  };
  return map[selectedService] || selectedService || "—";
};

const describeSelectedPackage = (selectedPackage = "") => {
  if (!selectedPackage) return "—";
  const noContractMatch = selectedPackage.match(/^no-contract-(.+)$/);
  if (noContractMatch) {
    const speed = noContractMatch[1];
    return `بدون عقد • ${speed} ميغابت/ثانية`;
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
  return `${kindLabel} • ${speed} ميغابت/ثانية • ${durationLabel}`;
};

const formatPhoneNumber = (value = "") => {
  let formatted = value.replace(/\D/g, "");
  if (formatted.startsWith("90")) {
    formatted = formatted.substring(2);
  }
  if (formatted.startsWith("0")) {
    formatted = formatted.substring(1);
  }
  if (formatted.length > 10) {
    formatted = formatted.substring(0, 10);
  }
  let display = "0 ";
  if (formatted.length > 0) {
    display += `(${formatted.substring(0, 3)}`;
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

const getStepFieldOrder = (step, values) => {
  if (step === 1) return ["name", "phone"];
  if (step === 2) return ["hasInternet"];
  if (step === 3) return ["serviceType"];
  if (step === 4) {
    if (values?.serviceType === "services") return ["selectedService"];
    if (values?.serviceType === "newline") return ["contractPreference"];
    return ["contractPreference", "selectedService"];
  }
  if (step === 5) return ["selectedPackage"];
  if (step === 6) return ["address"];
  return [];
};

const getNextStep = (step, values) => {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) {
    if (values.serviceType === "services" || values.serviceType === "newline")
      return 4;
    if (values.serviceType === "inquiry") return 6;
  }
  if (step === 4) {
    if (values.serviceType === "services") return 6;
    if (values.serviceType === "newline") {
      return values.contractPreference === "without" ? 6 : 5;
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
  if (step === 5) return 4;
  if (step === 6) {
    if (values.serviceType === "services") return 4;
    if (values.serviceType === "newline") {
      return values.contractPreference === "without" ? 4 : 5;
    }
    if (values.serviceType === "inquiry") return 3;
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
  // show first 4 digits, hide rest
  return maskValue(digits, 4, 0);
};

const maskName = (name = "") => {
  if (!name) return "—";
  // show first 2 characters
  return maskValue(name.trim(), 2, 0);
};

const maskAddress = (address = "") => {
  if (!address) return "—";
  // show first 5 chars
  return maskValue(address.trim(), 5, 0);
};

export {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  formatPhoneNumber,
  getNextStep,
  getPreviousStep,
  getStepFieldOrder,
  parsePackageDurations,
  maskValue,
  maskPhone,
  maskName,
  maskAddress,
};
