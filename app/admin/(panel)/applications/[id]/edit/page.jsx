"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdSave, MdArrowBack, MdOutlineRefresh, MdClose } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import Button from "@/components/Button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { STATUS_LABELS } from "@/utils/data";
import { formatPhoneNumber, formatBirthDate, validateTC } from "@/utils/general";

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
  { value: "cancel", label: "إلغاء الاشتراك" },
  { value: "transfer-name", label: "نقل ملكية" },
  { value: "transfer-address", label: "نقل خط الإنترنت لعنوان آخر" },
  { value: "renew", label: "تجديد الاشتراك" },
  { value: "freeze", label: "تجميد الاشتراك" },
  { value: "upgrade", label: "تحويل من عقد لبدون عقد" },
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

// Generates package options automatically
const generatePackageOptions = () => {
  const options = [];
  const familySpeeds = ["16", "24", "50", "100"];
  familySpeeds.forEach((s) => {
    options.push({ value: `family-18-${s}`, label: `عائلية - 18 شهر - ${s} ميجا` });
    options.push({ value: `family-24-${s}`, label: `عائلية - سنتين - ${s} ميجا` });
  });
  const vipSpeeds = ["16", "24", "50", "100", "200", "500", "1000"];
  vipSpeeds.forEach((s) => {
    options.push({ value: `vip-12-${s}`, label: `VIP - سنة - ${s} ميجا` });
    options.push({ value: `vip-18-${s}`, label: `VIP - 18 شهر - ${s} ميجا` });
  });
  return options;
};

const PACKAGE_OPTIONS = generatePackageOptions();

export default function EditApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
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
  });

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`/api/admin/applications/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load application");
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
          delayedUntil: data.delayedUntil ? data.delayedUntil.split("T")[0] : "",
          phone2: data.phone2 || "",
          nationalNumber: data.nationalNumber || "",
          newNationalNumber: data.newNationalNumber || "",
          birthDate: data.birthDate
            ? (data.birthDate.includes("-") 
               ? data.birthDate.split("-").reverse().join("/") 
               : data.birthDate)
            : "",
          invoiceFileUrls: data.invoiceFileUrl ? data.invoiceFileUrl.split(",").filter(Boolean) : [],
          invoiceFiles: [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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

    if (name === "birthDate") {
      finalValue = formatBirthDate(finalValue);
    }

    if (name === "nationalNumber" || name === "newNationalNumber") {
      finalValue = finalValue.replace(/\D/g, "").substring(0, 11);
    }

    setFormData((prev) => ({ 
      ...prev, 
      [name]: finalValue 
    }));
  };

  const parseEmptyToNull = (val) => (val === "" ? null : val);

  const handleSave = async (e) => {
    e.preventDefault();
    if ((formData.nationalNumber.length === 11 && !validateTC(formData.nationalNumber)) || (formData.newNationalNumber.length === 11 && !validateTC(formData.newNationalNumber))) {
        alert("يرجى التأكد من الرقم الوطني (TC) قبل الحفظ. الرقم الحالي غير صالح.");
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
        newOriginalAddressText: parseEmptyToNull(formData.newOriginalAddressText),
        delayedUntil: formData.status === "DELAYED" && formData.delayedUntil
          ? formData.delayedUntil
          : null,
      };

      // Append all scalar fields to FormData
      Object.entries(payloadData).forEach(([key, value]) => {
        if (key !== "invoiceFiles" && key !== "invoiceFileUrls" && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      // Append saved urls and new files
      payload.append("existingInvoiceFileUrls", formData.invoiceFileUrls.join(","));
      formData.invoiceFiles.forEach((file) => {
        payload.append("invoiceFiles", file);
      });

      const url = id === "new" ? "/api/admin/applications" : `/api/admin/applications/${id}`;
      const method = id === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        // The fetch API will automatically set the correct Content-Type with the boundary if we omit the header when body is FormData
        body: payload,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save application");
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <MdOutlineRefresh className="animate-spin text-cyan-600 mb-2" size={40} />
        <p className="font-medium text-lg">جاري تحميل البيانات…</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-slate-50/50 py-3 px-4 text-sm text-gray-900 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-500/20";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-3 font-bold text-gray-800">
            <img src="/logo.png" alt="" className="h-9 w-auto object-contain" />
              لوحة الإدارة - تحرير الطلب
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800">تحرير الطلب</h1>
          <button
            type="button"
            onClick={() => router.push("/admin")}
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
            <label className={labelClass}>{formData.selectedService === "transfer-name" ? "الإسم واللقب القديم" : "الإسم واللقب"}</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{formData.selectedService === "transfer-name" ? "الرقم الوطني القديم (TC)" : "الرقم الوطني (TC)"}</label>
            <input
              name="nationalNumber"
              type="text"
              maxLength={11}
              value={formData.nationalNumber}
              onChange={handleChange}
              className={`${inputClass} ${formData.nationalNumber.length === 11 && !validateTC(formData.nationalNumber) ? "border-red-500! ring-red-500/30!" : ""}`}
              placeholder="اكتب الرقم الوطني (11 خانة)"
            />
            {formData.nationalNumber.length === 11 && !validateTC(formData.nationalNumber) && (
              <p className="text-red-500 text-[10px] md:text-xs mt-1 font-bold">
                ⚠️ رقم TC غير صالح (يرجى التأكد من الأرقام)
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>{formData.selectedService === "transfer-name" ? "رقم الموبايل القديم" : formData.selectedService === "change-phone" ? "رقم الموبايل القديم" : "رقم الموبايل"}</label>
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
            <label className={labelClass}>المواليد بالكامل (DD/MM/YYYY)</label>
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
          <div>
            <label className={labelClass}>حالة الطلب</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              {Object.entries(STATUS_LABELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          {formData.status === "DELAYED" && (
            <div>
              <label className={labelClass}>تاريخ التأجيل</label>
              <input
                name="delayedUntil"
                type="date"
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
              <div>
                <label className={labelClass}>الباقة المختارة</label>
                <select
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">غير محدد</option>
                  {PACKAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {formData.serviceType === "newline" &&
            formData.contractPreference === "without" && (
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

          <div>
            <label className={labelClass}>شركة الإنترنت</label>
            <input
              name="internetCompany"
              type="text"
              value={formData.internetCompany}
              onChange={handleChange}
              className={inputClass}
            />
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
                <label className={labelClass}>{formData.selectedService === "transfer-address" ? "كود العنوان الحالي (BBK)" : "كود العنوان (BBK)"}</label>
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
                <label htmlFor="originalAddress" className="text-sm font-semibold text-gray-700 cursor-pointer">
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
            
            {(formData.selectedService === "transfer-address") && (
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

            {(formData.selectedService === "transfer-address") && (
              <>
                    <div>
                      <label className={labelClass}>كود العنوان الجديد (BBK)</label>
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
                      <label htmlFor="newOriginalAddress" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        العنوان الجديد هو العنوان الأساسي؟
                      </label>
                    </div>

                {!formData.newOriginalAddress && (
                  <div className="md:col-span-2">
                    <label className={labelClass}>العنوان الأساسي الجديد</label>
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
            
            {(formData.selectedService === "transfer-name") && (
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
                  <label className={labelClass}>الرقم الوطني للمالك الجديد (TC)</label>
                  <input
                    name="newNationalNumber"
                    type="text"
                    value={formData.newNationalNumber}
                    onChange={handleChange}
                    className={`${inputClass} ${formData.newNationalNumber.length === 11 && !validateTC(formData.newNationalNumber) ? "border-red-500! ring-red-500/30!" : ""}`}
                    placeholder="اكتب الرقم الوطني (11 خانة)"
                  />
                  {formData.newNationalNumber.length === 11 && !validateTC(formData.newNationalNumber) && (
                    <p className="text-red-500 text-[10px] md:text-xs mt-1 font-bold">
                      ⚠️ رقم TC غير صالح (يرجى التأكد من الأرقام)
                    </p>
                  )}
                </div>
              </>
            )}
            {(formData.selectedService === "change-phone") && (
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
            <label className={labelClass}>ملاحظة من فريق الخدمة للمشترك</label>
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
              {(formData.invoiceFiles.length + formData.invoiceFileUrls.length) < 5 && (
                <button
                  type="button"
                  onClick={() => document.getElementById("admin-invoice-upload").click()}
                  className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-800 font-bold bg-cyan-50 px-3 py-1.5 rounded-lg transition"
                >
                  <TbFileInvoiceFilled size={18} />
                  إضافة صورة
                </button>
              )}
            </div>
            
            <input
              type="file"
              id="admin-invoice-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                let newFiles = Array.from(e.target.files);
                const currentTotal = formData.invoiceFiles.length + formData.invoiceFileUrls.length;
                const allowed = 5 - currentTotal;
                if (allowed <= 0) return;
                if (newFiles.length > allowed) newFiles = newFiles.slice(0, allowed);
                setFormData(prev => ({ ...prev, invoiceFiles: [...prev.invoiceFiles, ...newFiles] }));
                e.target.value = "";
              }}
            />

            {(formData.invoiceFiles.length > 0 || formData.invoiceFileUrls.length > 0) && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {formData.invoiceFileUrls.map((url, idx) => (
                  <div key={`saved-${idx}`} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50 flex flex-col justify-between">
                    <img src={url} alt={`Saved ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = [...formData.invoiceFileUrls];
                          newUrls.splice(idx, 1);
                          setFormData(prev => ({ ...prev, invoiceFileUrls: newUrls }));
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="حذف"
                      >
                        <MdClose size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {formData.invoiceFiles.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border-2 border-green-400 shadow-sm aspect-square bg-green-50 flex flex-col justify-between">
                    <img src={blobUrls[idx]} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = [...formData.invoiceFiles];
                          newFiles.splice(idx, 1);
                          setFormData(prev => ({ ...prev, invoiceFiles: newFiles }));
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
