"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdSave, MdArrowForward, MdOutlineRefresh } from "react-icons/md";
import Button from "@/components/Button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const STATUS_OPTIONS = [
  { value: "NOT_COMPLETED", label: "غير مكتمل" },
  { value: "UNDER_REVIEW", label: "قيد المراجعة" },
  { value: "REJECTED", label: "مرفوض" },
  { value: "COMPLETED", label: "مكتمل" },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "newline", label: "خط جديد" },
  { value: "services", label: "خدمات" },
  { value: "inquiry", label: "استشارات" },
];

const CONTRACT_PREF_OPTIONS = [
  { value: "with", label: "مع عقد" },
  { value: "without", label: "بدون عقد" },
];

const SELECTED_SERVICE_OPTIONS = [
  { value: "cancel", label: "إلغاء الاشتراك" },
  { value: "transfer-name", label: "نقل ملكية (تغيير الإسم)" },
  { value: "transfer-address", label: "نقل خط (تغيير العنوان)" },
  { value: "renew", label: "تجديد الاشتراك" },
  { value: "freeze", label: "تجميد الاشتراك" },
  { value: "upgrade", label: "تحويل من عقد لبدون عقد" },
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
    address: "",
    note: "",
    adminNote: "",
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
          address: data.address || "",
          note: data.note || "",
          adminNote: data.adminNote || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseEmptyToNull = (val) => (val === "" ? null : val);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contractPreference: parseEmptyToNull(formData.contractPreference),
          selectedService: parseEmptyToNull(formData.selectedService),
          selectedPackage: parseEmptyToNull(formData.selectedPackage),
          noContractTechType: parseEmptyToNull(formData.noContractTechType),
          selectedInquiry: parseEmptyToNull(formData.selectedInquiry),
          internetCompany: parseEmptyToNull(formData.internetCompany),
          subscriptionNo: parseEmptyToNull(formData.subscriptionNo),
          adminNote: parseEmptyToNull(formData.adminNote),
        }),
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
            <MdArrowForward size={20} />
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
            <label className={labelClass}>الإسم</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>رقم الموبايل</label>
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
            <label className={labelClass}>حالة الطلب</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
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

          {formData.serviceType === "services" && (
            <>
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
            </>
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
            <label className={labelClass}>ملاحظة من الفريق (للمستخدم)</label>
            <textarea
              name="adminNote"
              rows={3}
              value={formData.adminNote}
              onChange={handleChange}
              className={`${inputClass} !bg-cyan-50/50 !border-cyan-200`}
              placeholder="اكتب رسالة للمستخدم هنا للرد على استفساره..."
            />
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
