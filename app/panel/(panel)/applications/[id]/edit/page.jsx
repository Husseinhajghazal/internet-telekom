"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MdSave,
  MdArrowBack,
  MdOutlineRefresh,
  MdClose,
  MdContentCopy,
  MdDone,
  MdCalendarMonth,
  MdDescription,
  MdHome,
  MdOutlineReceiptLong,
  MdPerson,
  MdPhone,
  MdSpeed,
  MdUpdate,
  MdOutlinePinDrop,
  MdCancel,
  MdError,
  MdPictureAsPdf,
} from "react-icons/md";
import { FaBuildingCircleCheck, FaIdCard } from "react-icons/fa6";
import { PiSpeedometerFill } from "react-icons/pi";
import { TbFileInvoiceFilled } from "react-icons/tb";
import Button from "@/components/Button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import { STATUS_LABELS } from "@/utils/data";
import {
  formatPhoneNumber,
  formatBirthDate,
  validateTC,
  describeServiceType,
  describeContractPreference,
  describeSelectedService,
  describeSelectedPackage,
  describeNoContractTechType,
  describeSelectedInquiry,
  describeStatus,
  statusBadgeClass,
} from "@/utils/general";
import { useNavigationGuard } from "@/components/admin/NavigationGuardContext";

const CONTRACT_PREF_OPTIONS = [
  { value: "with", label: "مع عقد إشتراك" },
  { value: "without", label: "بدون عقد إشتراك" },
];

const SELECTED_SERVICE_OPTIONS = [
  { value: "cancel", label: "إلغاء الإشتراك" },
  { value: "transfer-name", label: "نقل ملكية" },
  { value: "transfer-address", label: "نقل خط الإنترنت لعنوان آخر" },
  { value: "renew", label: "تجديد الإشتراك" },
  { value: "freeze", label: "تجميد الإشتراك" },
  { value: "change-phone", label: "تغيير رقم الموبايل المثبت" },
];

const INQUIRY_OPTIONS = [
  { value: "pricing", label: "استفسار عن الأسعار والعروض" },
  { value: "coverage", label: "استفسار عن تغطية المنطقة" },
  { value: "technical", label: "استفسار عن مشكلة تقنية" },
  { value: "general", label: "استفسار عام" },
  { value: "transfer-issue", label: "نقل الخط" },
  { value: "slow-speed", label: "سرعة الخط" },
  { value: "high-bill", label: "الفاتورة مرتفعة" },
  { value: "internet-down", label: "الإنترنت متوقف" },
];

const TECH_TYPE_OPTIONS = [
  { value: "vdsl", label: "VDSL" },
  { value: "fiber", label: "Fiber" },
  { value: "gigafiber", label: "GigaFiber" },
];

const PKG_DURATIONS = {
  family: [
    { value: "18", label: "18 شهر" },
    { value: "24", label: "سنتين" },
  ],
  vip: [
    { value: "12", label: "سنة" },
    { value: "18", label: "18 شهر" },
  ],
};
const PKG_SPEEDS = {
  family: ["16", "24", "50", "100"],
  vip: ["16", "24", "50", "100", "200", "500", "1000"],
};

const ACCENT = "#18a2e3";
const ACCENT_DARK = "#0d8bc9";

const Row = ({ dir = "rtl", label, icon, children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white/80 p-3 md:p-4 text-right space-y-1 shadow-sm shadow-slate-100/50 ${className}`}
  >
    <div className="flex items-center justify-end gap-2 text-xs text-gray-500 font-bold">
      {icon && <span style={{ color: ACCENT }}>{icon}</span>}
      <span>{label}</span>
    </div>
    <div
      dir={dir}
      className="text-gray-800 font-semibold text-sm whitespace-pre-wrap wrap-break-word"
    >
      {children}
    </div>
  </div>
);

const formatDisplayDateFromIso = (value) => {
  if (!value) return "";
  return value.includes("-") ? value.split("-").reverse().join("/") : value;
};

const formatIsoDateFromDisplay = (value) => {
  if (!value) return "";
  const parts = value.split("/");
  if (parts.length !== 3) return "";

  const [day, month, year] = parts;
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return "";

  return `${year}-${month}-${day}`;
};

const INITIAL_FORM_DATA = {
  status: "",
  name: "",
  newName: "",
  phone: "",
  hasInternet: "",
  serviceType: "",
  contractPreference: "",
  selectedService: "",
  selectedPackage: "",
  noContractTechType: "",
  selectedInquiry: "",
  internetCompany: "",
  subscriptionNo: "",
  lastInvoiceAmount: "",
  address: "",
  newAddress: "",
  newPhone: "",
  addressCode: "",
  newAddressCode: "",
  note: "",
  adminNote: "",
  delayedUntil: "",
  phone2: "",
  nationalNumber: "",
  newNationalNumber: "",
  birthDate: "",
  originalAddress: true,
  originalAddressText: "",
  newOriginalAddress: true,
  newOriginalAddressText: "",
  invoiceFileUrls: [],
  invoiceFiles: [],
  electronicApproval: false,
  approvalViaShipping: false,
  paidByUserName: false,
  paidByName: "",
  discountCount: "",
  createdBy: "",
  createdAt: "",
  completedAt: "",
};

export default function EditApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromView = searchParams.get("from");

  const backPath =
    fromView === "services"
      ? "/panel/services"
      : fromView === "expiring"
        ? "/panel/expiring"
        : fromView === "internet"
          ? "/panel"
          : fromView
            ? "/panel"
            : "/panel/added";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const originalData = useRef(null);
  const pendingNavCallback = useRef(null);

  const showToast = (message, type = "error") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };
  const [userRole, setUserRole] = useState(null);
  const [editDates, setEditDates] = useState(false);
  const [pkgDuration, setPkgDuration] = useState("");
  const [pkgSpeed, setPkgSpeed] = useState("");

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [users, setUsers] = useState([]);
  const [copiedField, setCopiedField] = useState(null);

  const copyPhone = (value, field) => {
    const digits = (value || "").replace(/\D/g, "").replace(/^0/, "");
    if (!digits) return;
    navigator.clipboard.writeText(digits);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isDirty = useMemo(() => {
    if (!originalData.current) return false;
    const { invoiceFiles: _cf, ...current } = formData;
    const { invoiceFiles: _of, ...original } = originalData.current;
    return (
      JSON.stringify(current) !== JSON.stringify(original) ||
      formData.invoiceFiles.length > 0
    );
  }, [formData]);

  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Auto-select internetCompany based on service rules
  useEffect(() => {
    setFormData((prev) => {
      let newCompany = prev.internetCompany;
      if (
        prev.serviceType === "newline" &&
        prev.contractPreference === "without"
      ) {
        newCompany = "Turknet";
      }

      if (newCompany !== prev.internetCompany) {
        return { ...prev, internetCompany: newCompany };
      }
      return prev;
    });
  }, [
    formData.selectedService,
    formData.serviceType,
    formData.contractPreference,
  ]);

  // Register the dirty guard with the NavigationGuardContext so sidebar/mobile nav
  // links will prompt before navigating away with unsaved changes.
  const navGuard = useNavigationGuard();
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (!navGuard) return;
    const unregister = navGuard.registerGuard(() => isDirtyRef.current);
    return unregister;
  }, [navGuard]);

  const handleNavAway = (callback) => {
    if (isDirty) {
      pendingNavCallback.current = callback;
      setLeaveConfirmOpen(true);
    } else {
      callback();
    }
  };

  const handleConfirmLeave = () => {
    setLeaveConfirmOpen(false);
    const cb = pendingNavCallback.current;
    pendingNavCallback.current = null;
    cb?.();
  };

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`/api/panel/applications/${id}`);
        if (res.status === 401) {
          router.push("/panel/login");
          return;
        }
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to load application");
        const loadedData = {
          status: data.status || "",
          name: data.name || "",
          newName: data.newName || "",
          phone: data.phone || "",
          hasInternet: data.hasInternet || "",
          serviceType: data.serviceType || "",
          contractPreference: data.contractPreference || "",
          selectedService: data.selectedService || "",
          selectedPackage: data.selectedPackage || "",
          noContractTechType: data.noContractTechType || "",
          selectedInquiry: data.selectedInquiry || "",
          internetCompany: data.internetCompany || "",
          subscriptionNo: data.subscriptionNo || "",
          lastInvoiceAmount: data.lastInvoiceAmount || "",
          address: data.address || "",
          newAddress: data.newAddress || "",
          newPhone: data.newPhone || "",
          addressCode: data.addressCode || "",
          newAddressCode: data.newAddressCode || "",
          originalAddress: data.originalAddress ?? true,
          originalAddressText: data.originalAddressText || "",
          newOriginalAddress: data.newOriginalAddress ?? true,
          newOriginalAddressText: data.newOriginalAddressText || "",
          note: data.note || "",
          adminNote: data.adminNote || "",
          delayedUntil: data.delayedUntil
            ? formatDisplayDateFromIso(data.delayedUntil.split("T")[0])
            : "",
          phone2: data.phone2 || "",
          nationalNumber: data.nationalNumber || "",
          newNationalNumber: data.newNationalNumber || "",
          birthDate: data.birthDate
            ? data.birthDate.includes("-")
              ? data.birthDate.split("-").reverse().join("/")
              : data.birthDate
            : "",
          invoiceFileUrls: data.invoiceFileUrl
            ? data.invoiceFileUrl.split(",").filter(Boolean)
            : [],
          invoiceFiles: [],
          electronicApproval: data.electronicApproval ?? false,
          approvalViaShipping: data.approvalViaShipping ?? false,
          paidByUserName: data.paidByUserName ?? false,
          paidByName: data.paidByName || "",
          discountCount: data.discountCount || "",
          createdBy: data.createdBy || "",
          createdAt: data.createdAt
            ? formatDisplayDateFromIso(
                new Date(data.createdAt).toISOString().slice(0, 10),
              )
            : "",
          completedAt: data.completedAt
            ? formatDisplayDateFromIso(
                new Date(data.completedAt).toISOString().slice(0, 10),
              )
            : "",
        };
        setFormData(loadedData);
        originalData.current = loadedData;
        const pkgParts = (data.selectedPackage || "").split("-");
        setPkgDuration(pkgParts[1] || "");
        setPkgSpeed(pkgParts[2] || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const [usersRes, meRes] = await Promise.all([
          fetch("/api/panel/users"),
          fetch("/api/panel/me"),
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (meRes.ok) setUserRole((await meRes.json()).role);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
    if (id === "new") {
      const defaultServiceType =
        fromView === "internet"
          ? "newline"
          : fromView === "services"
            ? "services"
            : "";
      const initialData = {
        ...INITIAL_FORM_DATA,
        serviceType: defaultServiceType,
      };
      setFormData(initialData);
      originalData.current = initialData;
      setLoading(false);
    } else if (id) {
      fetchApp();
    }
  }, [id, fromView]);

  // Memoize blob URLs to prevent memory leaks from URL.createObjectURL
  const blobUrls = useMemo(() => {
    return formData.invoiceFiles.map((file) => URL.createObjectURL(file));
  }, [formData.invoiceFiles]);

  // Revoke blob URLs on cleanup / when files change
  useEffect(() => {
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (name === "phone" || name === "phone2" || name === "newPhone") {
      finalValue = formatPhoneNumber(finalValue);
    }

    if (
      name === "birthDate" ||
      name === "delayedUntil" ||
      name === "createdAt" ||
      name === "completedAt"
    ) {
      finalValue = formatBirthDate(finalValue);
    }

    if (name === "nationalNumber" || name === "newNationalNumber") {
      finalValue = finalValue.replace(/\D/g, "").substring(0, 11);
    }

    const NO_UPPERCASE = new Set([
      "phone",
      "phone2",
      "newPhone",
      "birthDate",
      "delayedUntil",
      "createdAt",
      "completedAt",
      "nationalNumber",
      "newNationalNumber",
      "discountCount",
      "lastInvoiceAmount",
    ]);
    if (
      (type === "text" || type === "textarea") &&
      !NO_UPPERCASE.has(name) &&
      typeof finalValue === "string"
    ) {
      finalValue = finalValue.toUpperCase();
    }

    setFormData((prev) => {
      let updates = { [name]: finalValue };

      if (name === "contractPreference") {
        updates.internetCompany = "";
        updates.noContractTechType = "";
        updates.selectedPackage = "";
        setPkgDuration("");
        setPkgSpeed("");
      }

      if (name === "internetCompany") {
        updates.selectedPackage = "";
        updates.noContractTechType = "";
        setPkgDuration("");
        setPkgSpeed("");
      }

      return { ...prev, ...updates };
    });
  };

  const handlePkgChange = (field, value) => {
    let newDuration = pkgDuration,
      newSpeed = pkgSpeed;
    if (field === "duration") {
      newDuration = value;
      newSpeed = "";
    } else if (field === "speed") {
      newSpeed = value;
    }
    setPkgDuration(newDuration);
    setPkgSpeed(newSpeed);
    const newPkg =
      pkgType && newDuration && newSpeed
        ? `${pkgType}-${newDuration}-${newSpeed}`
        : "";
    setFormData((prev) => ({ ...prev, selectedPackage: newPkg }));
  };

  const parseEmptyToNull = (val) => (val === "" ? null : val);

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.phone?.trim()) {
      showToast("رقم الهاتف مطلوب");
      return;
    }
    if (!formData.address?.trim()) {
      showToast("العنوان مطلوب");
      return;
    }
    if (!formData.addressCode?.trim()) {
      showToast("كود العنوان (BBK) مطلوب");
      return;
    }
    if (formData.status === "DELAYED" && !formData.delayedUntil?.trim()) {
      showToast("تاريخ التأجيل مطلوب عند اختيار حالة مؤجل");
      return;
    }
    if (
      formData.nationalNumber.length === 11 &&
      !validateTC(formData.nationalNumber)
    ) {
      showToast("الرقم الوطني (TC) غير صالح — يرجى التأكد من الأرقام");
      return;
    }
    if (
      formData.newNationalNumber.length === 11 &&
      !validateTC(formData.newNationalNumber)
    ) {
      showToast(
        "الرقم الوطني للمالك الجديد (TC) غير صالح — يرجى التأكد من الأرقام",
      );
      return;
    }

    setConfirmOpen(true);
  };

  const doSave = async () => {
    setConfirmOpen(false);
    setSaving(true);

    try {
      const payload = new FormData();

      const payloadData = {
        ...formData,
        serviceType: parseEmptyToNull(formData.serviceType),
        contractPreference: parseEmptyToNull(formData.contractPreference),
        selectedService: parseEmptyToNull(formData.selectedService),
        selectedPackage: parseEmptyToNull(formData.selectedPackage),
        noContractTechType: parseEmptyToNull(formData.noContractTechType),
        selectedInquiry: parseEmptyToNull(formData.selectedInquiry),
        internetCompany: parseEmptyToNull(formData.internetCompany),
        subscriptionNo: parseEmptyToNull(formData.subscriptionNo),
        adminNote: parseEmptyToNull(formData.adminNote),
        originalAddressText: parseEmptyToNull(formData.originalAddressText),
        newOriginalAddressText: parseEmptyToNull(
          formData.newOriginalAddressText,
        ),
        delayedUntil:
          formData.status === "DELAYED" && formData.delayedUntil
            ? formatIsoDateFromDisplay(formData.delayedUntil)
            : null,
        electronicApproval: formData.electronicApproval,
        approvalViaShipping: formData.approvalViaShipping,
        paidByUserName: formData.paidByUserName,
        paidByName: parseEmptyToNull(formData.paidByName),
        discountCount: parseEmptyToNull(formData.discountCount),
        createdBy: parseEmptyToNull(formData.createdBy),
        createdAt: formData.createdAt
          ? formatIsoDateFromDisplay(formData.createdAt)
          : null,
        completedAt: formData.completedAt
          ? formatIsoDateFromDisplay(formData.completedAt)
          : null,
      };

      // Append all scalar fields to FormData
      Object.entries(payloadData).forEach(([key, value]) => {
        if (
          key !== "invoiceFiles" &&
          key !== "invoiceFileUrls" &&
          value !== null &&
          value !== undefined
        ) {
          payload.append(key, value);
        }
      });

      // Append saved urls and new files
      payload.append(
        "existingInvoiceFileUrls",
        formData.invoiceFileUrls.join(","),
      );
      formData.invoiceFiles.forEach((file) => {
        payload.append("invoiceFiles[]", file);
      });

      const url =
        id === "new"
          ? "/api/panel/applications"
          : `/api/panel/applications/${id}`;
      const method = id === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        // The fetch API will automatically set the correct Content-Type with the boundary if we omit the header when body is FormData
        body: payload,
      });

      if (res.status === 401) {
        router.push("/panel/login");
        return;
      }
      if (res.status === 413) {
        throw new Error("حجم الملفات أكبر من الحد المسموح");
      }
      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("استجابة غير صالحة من الخادم");
      }
      if (!res.ok) throw new Error(json.error || "فشل الحفظ");
      originalData.current = { ...formData, invoiceFiles: [] };
      window.dispatchEvent(new Event("expiringCountInvalidated"));
      router.push(backPath);
    } catch (err) {
      showToast(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const pkgType =
    formData.internetCompany === "Göknet"
      ? "family"
      : formData.internetCompany === "Türk Telekom"
        ? "vip"
        : "";

  const topType =
    formData.serviceType === "newline"
      ? "newline"
      : formData.serviceType === "services" &&
          (formData.selectedService === "shurn" ||
            formData.selectedService === "shurn-turknet")
        ? "change-company"
        : formData.serviceType === "services"
          ? "services"
          : formData.serviceType === "inquiry"
            ? "inquiry"
            : "";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <MdOutlineRefresh
          className="animate-spin text-cyan-600 mb-2"
          size={40}
        />
        <p className="font-medium text-lg">جاري تحميل البيانات…</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-slate-50/50 py-3 px-4 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  const ADDED_STATUSES = ["NOT_COMPLETED", "COMPLETED"];
  const INTERNET_ONLY_STATUSES = [
    "WAITING_FOR_PORT",
    "UNDER_INSTALLATION",
    "ACTIVATED",
  ];
  const SERVICES_ONLY_STATUSES = [
    "UNDER_FREEZING",
    "UNDER_CANCELING",
    "UNDER_CHANGE",
    "UNDER_TRANSFER",
    "UNDER_RENEW",
    "OPEN_REGISTRATION",
  ];
  const SERVICES_ALLOWED_STATUSES = [
    "NEW",
    "UNDER_REVIEW",
    "UNDER_OBSERVATION",
    "OPEN_REGISTRATION",
    "TECHNICAL_PROBLEM",
    "TRYING_TO_PERSUADE",
    "REJECTED",
    "ACTIVATED",
  ];

  let editAllowedStatuses = ADDED_STATUSES.includes(formData.status)
    ? ["NOT_COMPLETED", "COMPLETED", "NEW"]
    : Object.keys(STATUS_LABELS).filter((s) => !ADDED_STATUSES.includes(s));

  if (fromView === "services") {
    editAllowedStatuses = editAllowedStatuses.filter((s) =>
      SERVICES_ALLOWED_STATUSES.includes(s),
    );
  } else if (fromView === "internet" || fromView === "expiring") {
    editAllowedStatuses = editAllowedStatuses.filter(
      (s) => !SERVICES_ONLY_STATUSES.includes(s),
    );
  }

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-9 w-auto object-contain lg:hidden"
              />
            </Link>
            <span className="lg:hidden">لوحة الإدارة - تحرير الطلب</span>
            <span className="hidden lg:inline-block">تحرير الطلب</span>
          </div>
          <div className="lg:hidden">
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800">
            تحرير الطلب
          </h1>
          <button
            type="button"
            onClick={() => handleNavAway(() => router.push(backPath))}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition"
          >
            العودة للقائمة
            <MdArrowBack size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6 text-right"
          dir="rtl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                {formData.selectedService === "transfer-name"
                  ? "الإسم واللقب القديم"
                  : "الإسم واللقب"}
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                {formData.selectedService === "transfer-name"
                  ? "الرقم الوطني القديم (TC)"
                  : "الرقم الوطني (TC)"}
              </label>
              <input
                name="nationalNumber"
                type="text"
                maxLength={11}
                value={formData.nationalNumber}
                onChange={handleChange}
                className={`${inputClass} ${formData.nationalNumber.length === 11 && !validateTC(formData.nationalNumber) ? "border-red-500! ring-red-500/30!" : ""}`}
                placeholder="اكتب الرقم الوطني (11 خانة)"
              />
              {formData.nationalNumber.length === 11 &&
                !validateTC(formData.nationalNumber) && (
                  <p className="text-red-500 text-[10px] md:text-xs mt-1 font-bold">
                    ⚠️ رقم TC غير صالح (يرجى التأكد من الأرقام)
                  </p>
                )}
            </div>
            <div>
              <label className={labelClass}>
                {formData.selectedService === "transfer-name"
                  ? "رقم الموبايل القديم"
                  : formData.selectedService === "change-phone"
                    ? "رقم الموبايل القديم"
                    : "رقم الموبايل"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="phone"
                  type="text"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => copyPhone(formData.phone, "phone")}
                  className="shrink-0 p-2.5 rounded-2xl border border-gray-200 text-gray-400 hover:text-cyan-600 hover:border-cyan-300 transition bg-slate-50/50"
                >
                  {copiedField === "phone" ? (
                    <MdDone size={18} className="text-emerald-500" />
                  ) : (
                    <MdContentCopy size={18} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>رقم موبايل ٱخر (إختياري)</label>
              <div className="flex items-center gap-2">
                <input
                  name="phone2"
                  type="text"
                  dir="ltr"
                  value={formData.phone2}
                  onChange={handleChange}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => copyPhone(formData.phone2, "phone2")}
                  className="shrink-0 p-2.5 rounded-2xl border border-gray-200 text-gray-400 hover:text-cyan-600 hover:border-cyan-300 transition bg-slate-50/50"
                >
                  {copiedField === "phone2" ? (
                    <MdDone size={18} className="text-emerald-500" />
                  ) : (
                    <MdContentCopy size={18} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>
                المواليد بالكامل (DD/MM/YYYY)
              </label>
              <input
                name="birthDate"
                type="text"
                placeholder="01/01/1990"
                dir="ltr"
                value={formData.birthDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            {userRole === "ADMIN" && (
              <div>
                <label className={labelClass}>من الذي سجل الطلب</label>
                <select
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {userRole === "ADMIN" && (
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setEditDates((v) => !v)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition ${editDates ? "bg-cyan-50 border-cyan-300 text-cyan-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <span
                    className={`w-8 h-4 rounded-full relative transition-colors ${editDates ? "bg-cyan-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${editDates ? "right-0.5" : "left-0.5"}`}
                    />
                  </span>
                  تعديل التواريخ
                </button>
              </div>
            )}
            {userRole === "ADMIN" && editDates && (
              <div>
                <label className={labelClass}>تاريخ التسجيل (DD/MM/YYYY)</label>
                <input
                  type="text"
                  name="createdAt"
                  placeholder="01/01/2026"
                  dir="ltr"
                  value={formData.createdAt}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}
            {userRole === "ADMIN" && editDates && (
              <div>
                <label className={labelClass}>تاريخ التفعيل (DD/MM/YYYY)</label>
                <input
                  type="text"
                  name="completedAt"
                  placeholder="01/01/2026"
                  dir="ltr"
                  value={formData.completedAt}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>حالة الطلب</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                {editAllowedStatuses.map((key) => (
                  <option key={key} value={key}>
                    {STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            {formData.status === "DELAYED" && (
              <div>
                <label className={labelClass}>تاريخ التأجيل</label>
                <input
                  name="delayedUntil"
                  type="text"
                  placeholder="01/01/2026"
                  dir="ltr"
                  value={formData.delayedUntil}
                  onChange={handleChange}
                  className={`${inputClass} border-orange-200! bg-orange-50/50! focus:border-orange-400! focus:ring-orange-500/20!`}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>نوع الطلب</label>
              <select
                value={topType}
                onChange={(e) => {
                  const val = e.target.value;
                  const updates = {
                    selectedPackage: "",
                    noContractTechType: "",
                    contractPreference: "",
                    internetCompany: "",
                    selectedService: "",
                  };
                  if (val === "newline") {
                    updates.serviceType = "newline";
                  } else if (val === "change-company") {
                    updates.serviceType = "services";
                    updates.selectedService = "shurn-turknet";
                  } else if (val === "services") {
                    updates.serviceType = "services";
                  } else {
                    updates.serviceType = "";
                  }
                  setPkgDuration("");
                  setPkgSpeed("");
                  setFormData((prev) => ({ ...prev, ...updates }));
                }}
                className={inputClass}
              >
                <option value="">غير محدد</option>
                {fromView !== "services" && (
                  <>
                    <option value="newline">خط إنترنت جديد</option>
                    <option value="change-company">تحويل لشركة ٱخرى</option>
                  </>
                )}
                {fromView !== "internet" && (
                  <option value="services">خدمات</option>
                )}
              </select>
            </div>
            {formData.serviceType === "newline" && (
              <div>
                <label className={labelClass}>نوع العقد</label>
                <select
                  name="contractPreference"
                  value={formData.contractPreference}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {CONTRACT_PREF_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {topType === "change-company" && (
              <div>
                <label className={labelClass}>الخدمة المختارة</label>
                <select
                  name="selectedService"
                  value={formData.selectedService}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="shurn-turknet">خدمة شورن لــ TURKNET</option>
                  <option value="shurn">خدمة شورن لــ GOKNET</option>
                </select>
              </div>
            )}
            {topType === "services" && (
              <div>
                <label className={labelClass}>الخدمة المختارة</label>
                <select
                  name="selectedService"
                  value={formData.selectedService}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {SELECTED_SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>شركة الإنترنت</label>
              <select
                name="internetCompany"
                value={formData.internetCompany}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">غير محدد</option>
                {formData.selectedService === "shurn" ? (
                  <>
                    <option value="Türk Telekom">Türk Telekom</option>
                    <option value="Turknet">Turknet</option>
                    <option value="Turkcell Superonline">
                      Turkcell Superonline
                    </option>
                    <option value="Vodafone Net">Vodafone Net</option>
                    <option value="Türksat Kablonet">Türksat Kablonet</option>
                    <option value="Millenicom">Millenicom</option>
                    <option value="Netspeed">Netspeed</option>
                    <option value="D-Smart Net">D-Smart Net</option>
                    <option value="Digiturk İnternet">Digiturk İnternet</option>
                    <option value="GIBIRNet">GIBIRNet</option>
                    <option value="Comnet">Comnet</option>
                    <option value="Turkcell Fiber">Turkcell Fiber</option>
                    <option value="FixNet">FixNet</option>
                    <option value="Oris Telekom">Oris Telekom</option>
                    <option value="İnternet Kutusu">İnternet Kutusu</option>
                    <option value="Niobe Telekom">Niobe Telekom</option>
                    <option value="PoyrazNet">PoyrazNet</option>
                    <option value="Smile ADSL">Smile ADSL</option>
                    <option value="Bimcell Ev İnterneti">
                      Bimcell Ev İnterneti
                    </option>
                    <option value="Telenet">Telenet</option>
                  </>
                ) : formData.selectedService === "shurn-turknet" ? (
                  <>
                    <option value="Göknet">Göknet</option>
                    <option value="Türk Telekom">Türk Telekom</option>
                    <option value="Turkcell Superonline">
                      Turkcell Superonline
                    </option>
                    <option value="Vodafone Net">Vodafone Net</option>
                    <option value="Türksat Kablonet">Türksat Kablonet</option>
                    <option value="Millenicom">Millenicom</option>
                    <option value="Netspeed">Netspeed</option>
                    <option value="D-Smart Net">D-Smart Net</option>
                    <option value="Digiturk İnternet">Digiturk İnternet</option>
                    <option value="GIBIRNet">GIBIRNet</option>
                    <option value="Comnet">Comnet</option>
                    <option value="Turkcell Fiber">Turkcell Fiber</option>
                    <option value="FixNet">FixNet</option>
                    <option value="Oris Telekom">Oris Telekom</option>
                    <option value="İnternet Kutusu">İnternet Kutusu</option>
                    <option value="Niobe Telekom">Niobe Telekom</option>
                    <option value="PoyrazNet">PoyrazNet</option>
                    <option value="Smile ADSL">Smile ADSL</option>
                    <option value="Bimcell Ev İnterneti">
                      Bimcell Ev İnterneti
                    </option>
                    <option value="Telenet">Telenet</option>
                  </>
                ) : formData.serviceType === "newline" &&
                  formData.contractPreference === "without" ? (
                  <option value="Turknet">Turknet</option>
                ) : formData.serviceType === "newline" &&
                  formData.contractPreference === "with" ? (
                  <>
                    <option value="Göknet">Göknet</option>
                    <option value="Türk Telekom">Türk Telekom</option>
                  </>
                ) : (
                  <>
                    <option value="Göknet">Göknet</option>
                    <option value="Türk Telekom">Türk Telekom</option>
                    <option value="Turknet">Turknet</option>
                    <option value="Turkcell Superonline">
                      Turkcell Superonline
                    </option>
                    <option value="Vodafone Net">Vodafone Net</option>
                    <option value="Türksat Kablonet">Türksat Kablonet</option>
                    <option value="Millenicom">Millenicom</option>
                    <option value="Netspeed">Netspeed</option>
                    <option value="D-Smart Net">D-Smart Net</option>
                    <option value="Digiturk İnternet">Digiturk İnternet</option>
                    <option value="GIBIRNet">GIBIRNet</option>
                    <option value="Comnet">Comnet</option>
                    <option value="Turkcell Fiber">Turkcell Fiber</option>
                    <option value="FixNet">FixNet</option>
                    <option value="Oris Telekom">Oris Telekom</option>
                    <option value="İnternet Kutusu">İnternet Kutusu</option>
                    <option value="Niobe Telekom">Niobe Telekom</option>
                    <option value="PoyrazNet">PoyrazNet</option>
                    <option value="Smile ADSL">Smile ADSL</option>
                    <option value="Bimcell Ev İnterneti">
                      Bimcell Ev İnterneti
                    </option>
                    <option value="Telenet">Telenet</option>
                  </>
                )}
              </select>
            </div>
            {formData.serviceType === "newline" &&
              formData.contractPreference === "with" && (
                <>
                  {pkgType && (
                    <div>
                      <label className={labelClass}>مدة العقد</label>
                      <select
                        value={pkgDuration}
                        onChange={(e) =>
                          handlePkgChange("duration", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">غير محدد</option>
                        {(PKG_DURATIONS[pkgType] || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {pkgType && pkgDuration && (
                    <div>
                      <label className={labelClass}>سرعة الباقة</label>
                      <select
                        value={pkgSpeed}
                        onChange={(e) =>
                          handlePkgChange("speed", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">غير محدد</option>
                        {(PKG_SPEEDS[pkgType] || []).map((s) => (
                          <option key={s} value={s}>
                            {s} ميجا
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            {((formData.serviceType === "newline" &&
              formData.contractPreference === "without") ||
              (formData.serviceType === "services" &&
                (formData.selectedService === "shurn" ||
                  formData.selectedService === "shurn-turknet"))) && (
              <div>
                <label className={labelClass}>نوع التقنية</label>
                <select
                  name="noContractTechType"
                  value={formData.noContractTechType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {(formData.internetCompany === "Göknet" ||
                  formData.selectedService === "shurn"
                    ? TECH_TYPE_OPTIONS.filter((t) => t.value !== "gigafiber")
                    : TECH_TYPE_OPTIONS
                  ).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>رقم الإشتراك</label>
              <input
                name="subscriptionNo"
                type="text"
                value={formData.subscriptionNo}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            {formData.serviceType === "inquiry" && (
              <div>
                <label className={labelClass}>الاستفسار</label>
                <select
                  name="selectedInquiry"
                  value={formData.selectedInquiry}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {INQUIRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.status !== "DELAYED" &&
              ((formData.serviceType === "services" &&
                formData.selectedService !== "shurn") ||
                (formData.serviceType === "newline" &&
                  formData.contractPreference === "without")) && (
                <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(formData.serviceType === "newline" ||
                    formData.selectedService === "shurn-turknet") && (
                    <>
                      <div className="flex items-center gap-3">
                        <input
                          name="electronicApproval"
                          id="electronicApproval"
                          type="checkbox"
                          checked={formData.electronicApproval}
                          onChange={handleChange}
                          className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
                        />
                        <label
                          htmlFor="electronicApproval"
                          className="text-sm font-semibold text-gray-700 cursor-pointer"
                        >
                          موافقة الكترونية
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          name="approvalViaShipping"
                          id="approvalViaShipping"
                          type="checkbox"
                          checked={formData.approvalViaShipping}
                          onChange={handleChange}
                          className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
                        />
                        <label
                          htmlFor="approvalViaShipping"
                          className="text-sm font-semibold text-gray-700 cursor-pointer"
                        >
                          موافقة عبر الشحن
                        </label>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      name="paidByUserName"
                      id="paidByUserName"
                      type="checkbox"
                      checked={formData.paidByUserName}
                      onChange={handleChange}
                      className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
                    />
                    <label
                      htmlFor="paidByUserName"
                      className="text-sm font-semibold text-gray-700 cursor-pointer"
                    >
                      مدفوع من {formData.name}
                    </label>
                  </div>
                  {!formData.paidByUserName && (
                    <div>
                      <label className={labelClass}>إسم الشخص الذي دفع</label>
                      <input
                        name="paidByName"
                        type="text"
                        value={formData.paidByName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="أدخل إسم الشخص الدافع"
                      />
                    </div>
                  )}
                  {(formData.serviceType === "newline" ||
                    formData.selectedService === "shurn-turknet") && (
                    <div>
                      <label className={labelClass}>عدد الخصومات</label>
                      <input
                        name="discountCount"
                        type="text"
                        value={formData.discountCount}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="مثال: 3"
                      />
                    </div>
                  )}
                </div>
              )}
            {topType === "services" && (
              <div>
                <label className={labelClass}>قيمة آخر فاتورة</label>
                <input
                  name="lastInvoiceAmount"
                  type="text"
                  value={formData.lastInvoiceAmount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className={labelClass}>العنوان</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelClass}>
                {formData.selectedService === "transfer-address"
                  ? "كود العنوان الحالي (BBK)"
                  : "كود العنوان (BBK)"}
              </label>
              <input
                name="addressCode"
                type="text"
                dir="ltr"
                value={formData.addressCode}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3 mt-8">
              <input
                name="originalAddress"
                id="originalAddress"
                type="checkbox"
                checked={formData.originalAddress}
                onChange={handleChange}
                className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
              />
              <label
                htmlFor="originalAddress"
                className="text-sm font-semibold text-gray-700 cursor-pointer"
              >
                عنوانك الحالي هو العنوان الأساسي؟
              </label>
            </div>
            {!formData.originalAddress && (
              <div>
                <label className={labelClass}>العنوان الأساسي</label>
                <input
                  name="originalAddressText"
                  type="text"
                  value={formData.originalAddressText}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            )}

            {formData.serviceType === "services" &&
              formData.selectedService === "transfer-address" && (
                <div className="md:col-span-2">
                  <label className={labelClass}>العنوان الجديد</label>
                  <textarea
                    name="newAddress"
                    rows={2}
                    value={formData.newAddress}
                    onChange={handleChange}
                    className={`${inputClass} border-cyan-200 bg-cyan-50/30`}
                    dir="ltr"
                    placeholder="سيظهر هنا العنوان الجديد في حال اختار المستخدم 'نقل العنوان'"
                  />
                </div>
              )}

            {formData.serviceType === "services" &&
              formData.selectedService === "transfer-address" && (
                <>
                  <div>
                    <label className={labelClass}>
                      كود العنوان الجديد (BBK)
                    </label>
                    <input
                      name="newAddressCode"
                      type="text"
                      dir="ltr"
                      value={formData.newAddressCode}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-8">
                    <input
                      name="newOriginalAddress"
                      id="newOriginalAddress"
                      type="checkbox"
                      checked={formData.newOriginalAddress}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#18a2e3] rounded focus:ring-[#18a2e3] cursor-pointer"
                    />
                    <label
                      htmlFor="newOriginalAddress"
                      className="text-sm font-semibold text-gray-700 cursor-pointer"
                    >
                      العنوان الجديد هو العنوان الأساسي؟
                    </label>
                  </div>

                  {!formData.newOriginalAddress && (
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        العنوان الأساسي الجديد
                      </label>
                      <input
                        name="newOriginalAddressText"
                        type="text"
                        value={formData.newOriginalAddressText}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  )}
                </>
              )}

            {formData.serviceType === "services" &&
              formData.selectedService === "transfer-name" && (
                <>
                  <div>
                    <label className={labelClass}>إسم ولقب المالك الجديد</label>
                    <input
                      name="newName"
                      type="text"
                      value={formData.newName}
                      onChange={handleChange}
                      className={`${inputClass} border-[#18a2e3]/20 bg-[#18a2e3]/5`}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      الرقم الوطني للمالك الجديد (TC)
                    </label>
                    <input
                      name="newNationalNumber"
                      type="text"
                      value={formData.newNationalNumber}
                      onChange={handleChange}
                      className={`${inputClass} ${formData.newNationalNumber.length === 11 && !validateTC(formData.newNationalNumber) ? "border-red-500! ring-red-500/30!" : ""}`}
                      placeholder="اكتب الرقم الوطني (11 خانة)"
                    />
                    {formData.newNationalNumber.length === 11 &&
                      !validateTC(formData.newNationalNumber) && (
                        <p className="text-red-500 text-[10px] md:text-xs mt-1 font-bold">
                          ⚠️ رقم TC غير صالح (يرجى التأكد من الأرقام)
                        </p>
                      )}
                  </div>
                </>
              )}
            {formData.serviceType === "services" &&
              (formData.selectedService === "change-phone" ||
                formData.selectedService === "transfer-name") && (
                <div>
                  <label className={labelClass}>رقم الموبايل الجديد</label>
                  <input
                    name="newPhone"
                    type="text"
                    value={formData.newPhone}
                    onChange={handleChange}
                    className={`${inputClass} border-[#18a2e3]/20 bg-[#18a2e3]/5`}
                    dir="ltr"
                    placeholder="اكتب رقم الموبايل الجديد"
                  />
                </div>
              )}

            <div className="md:col-span-2">
              <label className={labelClass}>ملاحظة</label>
              <textarea
                name="note"
                rows={3}
                value={formData.note}
                onChange={handleChange}
                className={`${inputClass} bg-orange-50/50! border-orange-200! focus:border-orange-300! focus:ring-orange-500/20!`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                ملاحظة من فريق الخدمة للمشترك
              </label>
              <textarea
                name="adminNote"
                rows={3}
                value={formData.adminNote}
                onChange={handleChange}
                className={`${inputClass} bg-cyan-50/50! border-cyan-200!`}
                placeholder="اكتب رسالة تنبيه للمشترك هنا..."
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className={labelClass + " mb-0!"}>المرفقات</label>
                {formData.invoiceFiles.length +
                  formData.invoiceFileUrls.length <
                  5 && (
                  <label
                    htmlFor="admin-invoice-upload"
                    className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-800 font-bold bg-cyan-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <TbFileInvoiceFilled size={18} />
                    إضافة ملف
                  </label>
                )}
              </div>

              <input
                type="file"
                id="admin-invoice-upload"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={async (e) => {
                  let newFiles = Array.from(e.target.files);
                  const currentTotal =
                    formData.invoiceFiles.length +
                    formData.invoiceFileUrls.length;
                  const allowed = 5 - currentTotal;
                  if (allowed <= 0) return;
                  if (newFiles.length > allowed)
                    newFiles = newFiles.slice(0, allowed);

                  const { compressImage } = await import("@/utils/general");
                  const compressedFiles = await Promise.all(
                    newFiles.map((file) => compressImage(file)),
                  );

                  const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB
                  const oversized = compressedFiles.find(
                    (f) => f.size > MAX_FILE_BYTES,
                  );
                  if (oversized) {
                    showToast(
                      `حجم الملف "${oversized.name}" أكبر من 20 ميجابايت`,
                    );
                    e.target.value = "";
                    return;
                  }

                  setFormData((prev) => ({
                    ...prev,
                    invoiceFiles: [...prev.invoiceFiles, ...compressedFiles],
                  }));
                  e.target.value = "";
                }}
              />

              {(formData.invoiceFiles.length > 0 ||
                formData.invoiceFileUrls.length > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {formData.invoiceFileUrls.map((url, idx) => {
                    const isPdf = url.toLowerCase().includes(".pdf");
                    return (
                      <div
                        key={`saved-${idx}`}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50 flex items-center justify-center"
                      >
                        {isPdf ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex flex-col items-center justify-center gap-1 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <MdPictureAsPdf size={44} />
                            <span className="text-xs text-gray-500">PDF</span>
                          </a>
                        ) : (
                          <img
                            src={url}
                            alt={`Saved ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = [...formData.invoiceFileUrls];
                              newUrls.splice(idx, 1);
                              setFormData((prev) => ({
                                ...prev,
                                invoiceFileUrls: newUrls,
                              }));
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="حذف"
                          >
                            <MdClose size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {formData.invoiceFiles.map((file, idx) => {
                    const isPdf = file.type === "application/pdf";
                    return (
                      <div
                        key={`new-${idx}`}
                        className="relative group rounded-xl overflow-hidden border-2 border-green-400 shadow-sm aspect-square bg-green-50 flex items-center justify-center"
                      >
                        {isPdf ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-red-500">
                            <MdPictureAsPdf size={44} />
                            <span className="text-xs text-gray-500 px-2 text-center line-clamp-2">
                              {file.name}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={blobUrls[idx]}
                            alt={`New ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = [...formData.invoiceFiles];
                              newFiles.splice(idx, 1);
                              setFormData((prev) => ({
                                ...prev,
                                invoiceFiles: newFiles,
                              }));
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="حذف"
                          >
                            <MdClose size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              variant="primary"
              type="submit"
              disabled={saving}
              className="rounded-xl! min-w-40"
              icon={
                saving ? (
                  <MdOutlineRefresh size={20} className="animate-spin" />
                ) : (
                  <MdSave size={20} />
                )
              }
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </form>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="flex items-start justify-between gap-3 p-4 md:p-5 text-white"
              style={{
                background: `linear-gradient(to left, ${ACCENT_DARK}, ${ACCENT})`,
              }}
            >
              <div className="text-right space-y-1 min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 text-white/90 text-sm font-medium">
                  <MdDescription size={20} />
                  مراجعة البيانات قبل الحفظ
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  تأكد من صحة البيانات قبل الحفظ
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="text-white hover:bg-white/15 rounded-xl p-1 transition shrink-0"
              >
                <MdCancel size={26} />
              </button>
            </div>

            <div
              className="overflow-y-auto p-4 md:p-6 space-y-4 bg-linear-to-b from-slate-50/50 to-white"
              dir="rtl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Row
                  label={formData.newName ? "الإسم واللقب القديم" : "الإسم"}
                  icon={<MdPerson size={18} />}
                >
                  {formData.name || "—"}
                </Row>

                {formData.newName && (
                  <Row
                    label="الإسم واللقب الجديد"
                    icon={<MdPerson size={18} />}
                  >
                    {formData.newName}
                  </Row>
                )}

                <Row
                  label={
                    formData.newName
                      ? "الرقم الوطني القديم (TC)"
                      : "الرقم الوطني (TC)"
                  }
                  icon={<FaIdCard size={18} />}
                >
                  {formData.nationalNumber || "—"}
                </Row>

                {formData.newNationalNumber && (
                  <Row
                    label="الرقم الوطني الجديد (TC)"
                    icon={<FaIdCard size={18} />}
                  >
                    {formData.newNationalNumber}
                  </Row>
                )}

                <Row label="المواليد" icon={<MdCalendarMonth size={18} />}>
                  {formData.birthDate || "—"}
                </Row>

                <Row
                  label={
                    formData.newName ? "رقم الموبايل القديم" : "رقم الموبايل"
                  }
                  icon={<MdPhone size={18} />}
                >
                  <span dir="ltr" className="inline-block">
                    {formData.phone || "—"}
                  </span>
                </Row>

                {formData.newPhone && (
                  <Row label="رقم الموبايل الجديد" icon={<MdPhone size={18} />}>
                    <span dir="ltr" className="inline-block">
                      {formData.newPhone}
                    </span>
                  </Row>
                )}

                <Row label="رقم الموبايل 2" icon={<MdPhone size={18} />}>
                  <span dir="ltr" className="inline-block">
                    {formData.phone2 || "—"}
                  </span>
                </Row>

                <Row label="حالة الطلب" icon={<MdSpeed size={18} />}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(formData.status)}`}
                  >
                    {describeStatus(formData.status)}
                  </span>
                </Row>

                {formData.status === "DELAYED" && formData.delayedUntil && (
                  <Row
                    label="تاريخ التأجيل"
                    icon={<MdCalendarMonth size={18} />}
                  >
                    <span className="inline-flex items-center gap-1.5 text-orange-700 font-bold">
                      {formData.delayedUntil}
                    </span>
                  </Row>
                )}

                <Row label="تاريخ التسجيل" icon={<MdCalendarMonth size={18} />}>
                  {formData.createdAt || "—"}
                </Row>

                <Row label="تاريخ التفعيل" icon={<MdUpdate size={18} />}>
                  {formData.completedAt || "—"}
                </Row>

                <Row label="نوع الطلب" icon={<MdDescription size={18} />}>
                  {describeServiceType(formData.serviceType)}
                </Row>

                {formData.serviceType === "newline" && (
                  <Row label="نوع العقد" icon={<MdDescription size={18} />}>
                    {describeContractPreference(formData.contractPreference)}
                  </Row>
                )}
                {formData.serviceType === "services" && (
                  <Row
                    label="الخدمة المختارة"
                    icon={<MdDescription size={18} />}
                  >
                    {describeSelectedService(formData.selectedService)}
                  </Row>
                )}

                {formData.serviceType === "newline" &&
                  formData.contractPreference === "with" && (
                    <Row label="الباقة المختارة" icon={<MdSpeed size={18} />}>
                      {describeSelectedPackage(formData.selectedPackage)}
                    </Row>
                  )}

                {((formData.serviceType === "newline" &&
                  formData.contractPreference === "without") ||
                  (formData.serviceType === "services" &&
                    (formData.selectedService === "shurn" ||
                      formData.selectedService === "shurn-turknet"))) && (
                  <Row
                    label="نوع التقنية"
                    icon={<PiSpeedometerFill size={18} />}
                  >
                    {formData.noContractTechType
                      ? describeNoContractTechType(formData.noContractTechType)
                      : "—"}
                  </Row>
                )}

                {formData.serviceType === "inquiry" && (
                  <Row label="الاستفسار" icon={<MdDescription size={18} />}>
                    {describeSelectedInquiry(formData.selectedInquiry)}
                  </Row>
                )}

                <Row
                  label="شركة الإنترنت"
                  icon={<FaBuildingCircleCheck size={18} />}
                >
                  {formData.internetCompany || "—"}
                </Row>

                <Row
                  label="رقم الإشتراك"
                  icon={<MdOutlineReceiptLong size={18} />}
                >
                  {formData.subscriptionNo || "—"}
                </Row>

                <Row
                  label={
                    formData.selectedService === "transfer-address"
                      ? "كود العنوان الحالي (BBK)"
                      : "كود العنوان (BBK)"
                  }
                  icon={<MdOutlinePinDrop size={18} />}
                >
                  {formData.addressCode || "—"}
                </Row>

                <Row label="نوع العنوان" icon={<MdHome size={18} />}>
                  {formData.originalAddress ? "الأساسي" : "مجاور"}
                </Row>

                <Row
                  label={
                    formData.selectedService === "transfer-address"
                      ? "العنوان الحالي"
                      : "العنوان"
                  }
                  dir="ltr"
                  className="sm:col-span-2"
                  icon={<MdHome size={18} />}
                >
                  {formData.address || "—"}
                </Row>

                {formData.selectedService === "transfer-address" && (
                  <>
                    <Row
                      label="كود العنوان الجديد (BBK)"
                      icon={<MdOutlinePinDrop size={18} />}
                    >
                      {formData.newAddressCode || "—"}
                    </Row>
                    <Row label="نوع العنوان الجديد" icon={<MdHome size={18} />}>
                      {formData.newOriginalAddress ? "الأساسي" : "مجاور"}
                    </Row>
                    <Row
                      label="العنوان الجديد"
                      dir="ltr"
                      className="sm:col-span-2"
                      icon={<MdHome size={18} />}
                    >
                      {formData.newAddress || "—"}
                    </Row>
                  </>
                )}

                {(formData.note || "").trim() && (
                  <Row
                    label="ملاحظة"
                    className="sm:col-span-2"
                    icon={<MdDescription size={18} />}
                  >
                    {formData.note}
                  </Row>
                )}

                {formData.status !== "DELAYED" &&
                  ((formData.serviceType === "services" &&
                    formData.selectedService === "shurn-turknet") ||
                    (formData.serviceType === "newline" &&
                      formData.contractPreference === "without")) && (
                    <>
                      <Row
                        label="موافقة الكترونية"
                        icon={<MdDescription size={18} />}
                      >
                        {formData.electronicApproval ? "نعم" : "لا"}
                      </Row>
                      <Row
                        label="موافقة عبر الشحن"
                        icon={<MdDescription size={18} />}
                      >
                        {formData.approvalViaShipping ? "نعم" : "لا"}
                      </Row>
                      <Row
                        label={`مدفوع من ${formData.name}`}
                        icon={<MdDescription size={18} />}
                      >
                        {formData.paidByUserName ? "نعم" : "لا"}
                      </Row>
                      {!formData.paidByUserName && (
                        <Row label="إسم الدافع" icon={<MdPerson size={18} />}>
                          {formData.paidByName || "—"}
                        </Row>
                      )}
                      {(formData.serviceType === "newline" ||
                        formData.selectedService === "shurn-turknet") && (
                        <Row
                          label="عدد الخصومات"
                          icon={<MdOutlineReceiptLong size={18} />}
                        >
                          {formData.discountCount || "—"}
                        </Row>
                      )}
                    </>
                  )}

                {formData.createdBy && (
                  <Row
                    label="من الذي سجل الطلب"
                    icon={<MdPerson size={18} />}
                    className="sm:col-span-2"
                  >
                    <span className="font-bold text-indigo-800">
                      {formData.createdBy}
                    </span>
                  </Row>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/90 flex gap-2 justify-center">
              <Button
                variant="primary"
                type="button"
                onClick={doSave}
                disabled={saving}
                className="rounded-xl! min-w-32"
                icon={
                  saving ? (
                    <MdOutlineRefresh size={18} className="animate-spin" />
                  ) : (
                    <MdSave size={18} />
                  )
                }
              >
                {saving ? "جاري الحفظ..." : "نعم، حفظ"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl! min-w-32"
              >
                رجوع
              </Button>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={leaveConfirmOpen}
        kind="reject"
        title="مغادرة دون حفظ؟"
        message="لديك تعديلات غير محفوظة. هل تريد المغادرة دون حفظ التغييرات؟"
        confirmLabel="مغادرة"
        cancelLabel="البقاء"
        onConfirm={handleConfirmLeave}
        onCancel={() => setLeaveConfirmOpen(false)}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold text-white max-w-sm w-[calc(100%-2rem)] bg-red-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <MdError size={20} className="shrink-0" />
          <span className="flex-1 text-center">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="shrink-0 opacity-70 hover:opacity-100 transition"
          >
            <MdClose size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
