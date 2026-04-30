"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdSave, MdArrowBack, MdOutlineRefresh, MdClose } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import Button from "@/components/Button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { STATUS_LABELS } from "@/utils/data";
import {
  formatPhoneNumber,
  formatBirthDate,
  validateTC,
} from "@/utils/general";

const SERVICE_TYPE_OPTIONS = [
  { value: "newline", label: "خط جديد" },
  { value: "services", label: "خدمات" },
  { value: "inquiry", label: "استشارات" },
];

const CONTRACT_PREF_OPTIONS = [
  { value: "with", label: "مع عقد إشتراك" },
  { value: "without", label: "بدون عقد إشتراك" },
];

const SELECTED_SERVICE_OPTIONS = [
  { value: "upgrade", label: "تحويل من عقد لبدون عقد" },
  { value: "cancel", label: "إلغاء الاشتراك" },
  { value: "transfer-name", label: "نقل ملكية" },
  { value: "transfer-address", label: "نقل خط الإنترنت لعنوان آخر" },
  { value: "renew", label: "تجديد الاشتراك" },
  { value: "freeze", label: "تجميد الاشتراك" },
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

const PKG_TYPES = [
  { value: "family", label: "عائلية" },
  { value: "vip", label: "VIP" },
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

export default function EditApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [pkgType, setPkgType] = useState("");
  const [pkgDuration, setPkgDuration] = useState("");
  const [pkgSpeed, setPkgSpeed] = useState("");

  const [formData, setFormData] = useState({
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
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`/api/panel/applications/${id}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to load application");
        setFormData({
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
        });
        const pkgParts = (data.selectedPackage || "").split("-");
        setPkgType(pkgParts[0] || "");
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
      setLoading(false);
    } else if (id) {
      fetchApp();
    }
  }, [id]);

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

    setFormData((prev) => {
      let updates = { [name]: finalValue };

      if (name === "serviceType" && finalValue === "services") {
        updates.selectedService = "upgrade";
      }

      if (
        name === "contractPreference" &&
        finalValue === "without" &&
        prev.serviceType === "newline"
      ) {
        updates.internetCompany = "Turknet";
      }

      return { ...prev, ...updates };
    });
  };

  const handlePkgChange = (field, value) => {
    let newType = pkgType,
      newDuration = pkgDuration,
      newSpeed = pkgSpeed;
    if (field === "type") {
      newType = value;
      newDuration = PKG_DURATIONS[value]?.[0]?.value || "";
      newSpeed = "";
    } else if (field === "duration") {
      newDuration = value;
    } else if (field === "speed") {
      newSpeed = value;
    }
    setPkgType(newType);
    setPkgDuration(newDuration);
    setPkgSpeed(newSpeed);
    const newPkg =
      newType && newDuration && newSpeed
        ? `${newType}-${newDuration}-${newSpeed}`
        : "";
    setFormData((prev) => ({ ...prev, selectedPackage: newPkg }));
  };

  const parseEmptyToNull = (val) => (val === "" ? null : val);

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      (formData.nationalNumber.length === 11 &&
        !validateTC(formData.nationalNumber)) ||
      (formData.newNationalNumber.length === 11 &&
        !validateTC(formData.newNationalNumber))
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = new FormData();

      const payloadData = {
        ...formData,
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

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save application");
      router.push("/panel");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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
  const editAllowedStatuses = ADDED_STATUSES.includes(formData.status)
    ? ["NOT_COMPLETED", "COMPLETED", "NEW"]
    : Object.keys(STATUS_LABELS).filter((s) => !ADDED_STATUSES.includes(s));

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-9 w-auto object-contain lg:hidden"
            />
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
            onClick={() => router.push("/panel")}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition"
          >
            العودة للقائمة
            <MdArrowBack size={20} />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-red-800 text-sm font-bold">
            {error}
          </div>
        )}

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
              <input
                name="phone"
                type="text"
                dir="ltr"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>رقم موبايل ٱخر (إختياري)</label>
              <input
                name="phone2"
                type="text"
                dir="ltr"
                value={formData.phone2}
                onChange={handleChange}
                className={inputClass}
              />
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
            {userRole === "ADMIN" && (
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
                  className={`${inputClass} !border-orange-200 !bg-orange-50/50 focus:!border-orange-400 focus:!ring-orange-500/20`}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>هل لديك إنترنت؟</label>
              <select
                name="hasInternet"
                value={formData.hasInternet}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">غير محدد</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>نوع الطلب</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">غير محدد</option>
                {SERVICE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {formData.serviceType === "newline" && (
              <div>
                <label className={labelClass}>نوع العرض</label>
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
            {formData.serviceType === "services" && (
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
            {formData.serviceType === "newline" &&
              formData.contractPreference === "with" && (
                <>
                  <div>
                    <label className={labelClass}>نوع الباقة</label>
                    <select
                      value={pkgType}
                      onChange={(e) => handlePkgChange("type", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">غير محدد</option>
                      {PKG_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {pkgType && (
                    <div>
                      <label className={labelClass}>مدة الباقة</label>
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
                formData.selectedService === "upgrade")) && (
              <div>
                <label className={labelClass}>نوع التقنية</label>
                <select
                  name="noContractTechType"
                  value={formData.noContractTechType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {TECH_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            {((formData.serviceType === "services" &&
              formData.selectedService === "upgrade") ||
              (formData.serviceType === "newline" &&
                formData.contractPreference === "without")) && (
              <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            )}

            <div>
              <label className={labelClass}>شركة الإنترنت</label>
              <input
                name="internetCompany"
                type="text"
                list="internetCompany-options"
                value={formData.internetCompany}
                onChange={handleChange}
                className={inputClass}
              />
              <datalist id="internetCompany-options">
                <option value="Türk Telekom" />
                <option value="Göknet" />
                <option value="Turknet" />
              </datalist>
            </div>

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

            {formData.serviceType === "services" && (
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
              formData.selectedService === "change-phone" && (
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
                className={inputClass}
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
                className={`${inputClass} !bg-cyan-50/50 !border-cyan-200`}
                placeholder="اكتب رسالة تنبيه للمشترك هنا..."
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className={labelClass + " !mb-0"}>الصور المرفقة</label>
                {formData.invoiceFiles.length +
                  formData.invoiceFileUrls.length <
                  5 && (
                  <label
                    htmlFor="admin-invoice-upload"
                    className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-800 font-bold bg-cyan-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <TbFileInvoiceFilled size={18} />
                    إضافة صورة
                  </label>
                )}
              </div>

              <input
                type="file"
                id="admin-invoice-upload"
                accept="image/*"
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
                  {formData.invoiceFileUrls.map((url, idx) => (
                    <div
                      key={`saved-${idx}`}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50 flex flex-col justify-between"
                    >
                      <img
                        src={url}
                        alt={`Saved ${idx}`}
                        className="w-full h-full object-cover"
                      />
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
                  ))}

                  {formData.invoiceFiles.map((_file, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative group rounded-xl overflow-hidden border-2 border-green-400 shadow-sm aspect-square bg-green-50 flex flex-col justify-between"
                    >
                      <img
                        src={blobUrls[idx]}
                        alt={`New ${idx}`}
                        className="w-full h-full object-cover"
                      />
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
                  ))}
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
    </div>
  );
}
