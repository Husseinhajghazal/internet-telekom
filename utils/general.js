import moment from 'moment';

const describeServiceType = (serviceType = "") => {
  if (serviceType === "newline") return "خط جديد";
  if (serviceType === "services") return "خدمات";
  if (serviceType === "inquiry") return "استشارات";
  return serviceType || "—";
};

const describeSelectedInquiry = (selectedInquiry = "") => {
  const map = {
    "pricing": "استفسار عن الأسعار والعروض",
    "coverage": "استفسار عن تغطية المنطقة",
    "technical": "استفسار عن مشكلة تقنية",
    "general": "استفسار عام",
    "transfer-issue": "نقل الخط - لا يمكنني النقل لعنواني الجديد",
    "slow-speed": "سرعة الخط - بطئ شديد في السرعة",
    "high-bill": "الفاتورة مرتفعة - فاتورة غير منتظمة وعشوائية",
    "internet-down": "الإنترنت متوقف - خط متوقف ولا يعمل",
  };
  return map[selectedInquiry] || selectedInquiry || "—";
};

const describeContractPreference = (contractPreference = "") => {
  if (contractPreference === "with") return "مع عقد";
  if (contractPreference === "without") return "بدون عقد";
  return contractPreference || "—";
};

const describeNoContractTechType = (techType = "") => {
  const map = {
    "vdsl": "VDSL",
    "fiber": "Fiber",
    "gigafiber": "GigaFiber",
  };
  return map[techType] || techType || "—";
};

const describeSelectedService = (selectedService = "") => {
  const map = {
    cancel: "إلغاء الاشتراك",
    "transfer-name": "نقل ملكية (تغيير الإسم)",
    "transfer-address": "نقل خط (تغيير العنوان)",
    renew: "تجديد الاشتراك",
    freeze: "تجميد الاشتراك",
    upgrade: "تحويل من عقد لبدون عقد",
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
    if (values?.serviceType === "inquiry") return ["selectedInquiry"];
    return ["contractPreference", "selectedService"];
  }
  if (step === 5) {
    if (values?.contractPreference === "with") return ["selectedPackage"];
    return [];
  }
  if (step === 6) {
    if (values?.serviceType === "inquiry") return [];
    if (values?.serviceType === "services") return ["internetCompany", "address"];
    return ["address"];
  }
  return [];
};

const getNextStep = (step, values) => {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) {
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
  if (step === 5) return 4;
  if (step === 6) {
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

function formatDate(date, type = '2') {
	const curDate = new Date(date);
	let dt;
	if (type == '1') {
		dt = moment(curDate).format('DD.MM.YYYY');
	} else if (type == '2') {
		dt = moment(curDate).format('YYYY-MM-DD HH:mm');
	} else if (type == '3') {
		dt = moment(curDate).format('YYYY-MM-DD  HH:mm:ss.000');
	} else if (type == '4') {
		dt = moment(curDate).format('YYYY-MM-DD');
	} else if (type == '5') {
		dt = moment(curDate).format('HH:mm');
	}
	return dt;
}

export {
  describeContractPreference,
  describeNoContractTechType,
  describeSelectedInquiry,
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
  formatDate
};
