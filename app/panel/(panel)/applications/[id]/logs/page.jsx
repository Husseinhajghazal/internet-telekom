"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdArrowForward,
  MdHistory,
  MdPerson,
  MdCalendarMonth,
  MdUpdate,
  MdOutlineLogin,
  MdSwapHoriz,
  MdDelete,
  MdRefresh,
  MdInfoOutline,
} from "react-icons/md";
import Link from "next/link";
import {
  formatDate,
  describeStatus,
  describeServiceType,
  describeContractPreference,
  describeSelectedService,
  describeNoContractTechType,
  describeSelectedInquiry,
  describeSelectedPackage,
  describeWithModem,
} from "@/utils/general";
import Button from "@/components/Button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const ACCENT = "#18a2e3";

const ACTION_MAP = {
  CREATE: {
    label: "إنشاء الطلب",
    icon: <MdOutlineLogin />,
    color: "text-emerald-600 bg-emerald-50",
  },
  UPDATE: {
    label: "تحديث البيانات",
    icon: <MdUpdate />,
    color: "text-blue-600 bg-blue-50",
  },
  STATUS_CHANGE: {
    label: "تغيير الحالة",
    icon: <MdSwapHoriz />,
    color: "text-violet-600 bg-violet-50",
  },
  DELETE: {
    label: "حذف الطلب",
    icon: <MdDelete />,
    color: "text-red-600 bg-red-50",
  },
  RESTORE: {
    label: "إستعادة الطلب",
    icon: <MdRefresh />,
    color: "text-indigo-600 bg-indigo-50",
  },
};

const FIELD_LABELS = {
  status: "الحالة",
  name: "الإسم",
  newName: "الإسم الجديد",
  phone: "رقم الموبايل",
  phone2: "رقم الموبايل 2",
  newPhone: "رقم الموبايل الجديد",
  nationalNumber: "الرقم الوطني",
  newNationalNumber: "الرقم الوطني الجديد",
  birthDate: "المواليد",
  addressCode: "كود العنوان",
  newAddressCode: "كود العنوان الجديد",
  address: "العنوان",
  newAddress: "العنوان الجديد",
  internetCompany: "شركة الإنترنت",
  subscriptionNo: "رقم الإشتراك",
  selectedPackage: "الباقة",
  serviceType: "نوع الخدمة",
  contractPreference: "نوع العقد",
  selectedService: "الخدمة المختارة",
  noContractTechType: "نوع التقنية",
  adminNote: "ملاحظة للمشترك",
  note: "ملاحظة إضافية",
  electronicApproval: "موافقة الكترونية",
  approvalViaShipping: "موافقة عبر الشحن",
  paidByUserName: "مدفوع من المشترك",
  withModem: "المودم",
  paidByName: "إسم الدافع",
  discountCount: "عدد الخصومات",
  createdBy: "من سجل الطلب",
  isDeleted: "حالة الحذف",
  delayedUntil: "تاريخ التأجيل",
  completedAt: "تاريخ التفعيل",
  whatsappStatus: "حالة الواتساب",
  selectedInquiry: "الاستفسار المختار",
  hasInternet: "يوجد إنترنت",
  originalAddress: "العنوان الحالي هو الأساسي",
  originalAddressText: "العنوان الأساسي الحالي",
  invoiceFileUrl: "مرفقات الفاتورة",
  lastInvoiceAmount: "قيمة آخر فاتورة",
  newOriginalAddress: "العنوان الجديد هو الأساسي",
  newOriginalAddressText: "العنوان الأساسي الجديد",
  adminNoteViewed: "تمت مشاهدة ملاحظة المشترك",
  createdAt: "تاريخ التسجيل",
  updatedAt: "تاريخ التحديث",
  lastUpdatedBy: "آخر من قام بالتحديث",
  reminderSent: "تم إرسال تذكير",
};

const VALUE_MAPS = {
  whatsappStatus: {
    NOT_ADDED: "غير مضاف",
    ADDED: "مضاف",
  },
  hasInternet: {
    yes: "نعم",
    no: "لا",
  },
};

const formatLogValue = (key, value, application) => {
  if (value === null || value === "" || value === undefined) return "—";
  // Before the generic boolean branch — this one reads as a phrase, not نعم/لا.
  if (key === "withModem") return describeWithModem(value);
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  if (["createdAt", "updatedAt", "completedAt", "delayedUntil"].includes(key)) {
    return formatDate(value, "4");
  }

  if (key === "status") return describeStatus(value, application);
  if (key === "serviceType") return describeServiceType(value);
  if (key === "contractPreference") return describeContractPreference(value);
  if (key === "selectedService") return describeSelectedService(value);
  if (key === "noContractTechType") return describeNoContractTechType(value);
  if (key === "selectedInquiry") return describeSelectedInquiry(value);
  if (key === "selectedPackage") return describeSelectedPackage(value);

  if (VALUE_MAPS[key] && VALUE_MAPS[key][value]) return VALUE_MAPS[key][value];
  return String(value);
};

export default function ApplicationLogsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [logs, setLogs] = useState([]);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, logsRes] = await Promise.all([
          fetch(`/api/panel/applications/${id}`),
          fetch(`/api/panel/applications/${id}/logs`),
        ]);

        if (!appRes.ok || !logsRes.ok) {
          throw new Error("فشل تحميل البيانات");
        }

        const appData = await appRes.json();
        const logsData = await logsRes.json();

        setApp(appData);
        setLogs(logsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">جاري تحميل سجل التعديلات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">
          <MdInfoOutline size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">حدث خطأ ما</h2>
          <p className="text-gray-600 max-w-xs mx-auto">{error}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="rounded-xl!"
        >
          العودة للخلف
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-linear-to-br from-slate-50 via-cyan-50/30 to-white overflow-x-hidden text-right">
      <header className="border-b border-cyan-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-cyan-500/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-9 w-auto object-contain lg:hidden"
              />
            </Link>
            <span className="lg:hidden">لوحة الإدارة</span>
            <span className="hidden lg:inline-block">
              لوحة الإدارة - سجل التعديلات
            </span>
          </div>
          <div className="lg:hidden">
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2.5 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition shadow-sm hover:shadow group"
              >
                <MdArrowForward
                  size={24}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  سجل التعديلات
                </h1>
                <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                  <span style={{ color: ACCENT }}>#{app?.appIndex}</span>
                  <span>•</span>
                  <span>{app?.name}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <MdHistory size={20} style={{ color: ACCENT }} />
              <span className="text-sm font-bold text-gray-700">
                {logs.length} سجل تعديل
              </span>
            </div>
          </div>

          <div className="relative space-y-6">
            <div className="absolute top-0 bottom-0 right-7 md:right-8 w-0.5 bg-slate-100" />

            {logs.map((log, idx) => {
              const actionInfo = ACTION_MAP[log.action] || {
                label: log.action,
                icon: <MdInfoOutline />,
                color: "text-gray-600 bg-gray-50",
              };

              return (
                <div
                  key={log.id}
                  className="relative md:pr-16 animate-in fade-in slide-in-from-right-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={`absolute right-0 top-0 w-14 md:w-16 h-14 md:h-16 rounded-2xl hidden md:flex items-center justify-center border-4 border-slate-50 shadow-sm z-10 ${actionInfo.color}`}
                  >
                    {React.cloneElement(actionInfo.icon, { size: 24 })}
                  </div>

                  <div className="bg-white md:mr-4 rounded-3xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                          {actionInfo.label}
                        </h3>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1 text-nowrap">
                            <MdPerson size={14} style={{ color: ACCENT }} />
                            {log.adminName}
                          </span>
                          <span className="flex items-center gap-1 text-nowrap">
                            <MdCalendarMonth
                              size={14}
                              style={{ color: ACCENT }}
                            />
                            {formatDate(log.createdAt, "2")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {log.changes ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-right border-separate border-spacing-0">
                          <thead>
                            <tr className="bg-slate-50/50">
                              <th className="p-3 text-xs font-extrabold text-gray-500 border-b border-slate-100 rounded-tr-xl">
                                الحقل
                              </th>
                              <th className="p-3 text-xs font-extrabold text-gray-500 border-b border-slate-100">
                                القيمة السابقة
                              </th>
                              <th className="p-3 text-xs font-extrabold text-gray-500 border-b border-slate-100 rounded-tl-xl">
                                القيمة الجديدة
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(log.changes).map(([key, val]) => (
                              <tr
                                key={key}
                                className="group hover:bg-slate-50/30 transition"
                              >
                                <td className="p-3 border-b border-slate-100 text-sm font-bold text-gray-700 whitespace-nowrap">
                                  {FIELD_LABELS[key] || key}
                                </td>
                                <td className="p-3 border-b border-slate-100">
                                  <span className="inline-block px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold line-through opacity-70">
                                    {formatLogValue(key, val.old, app)}
                                  </span>
                                </td>
                                <td className="p-3 border-b border-slate-100">
                                  <span className="inline-block px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                                    {formatLogValue(key, val.new, app)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : log.action === "CREATE" ? (
                      <div className="mt-2 text-sm text-gray-600 font-medium italic border-r-2 border-emerald-200 pr-3 py-1">
                        تم إنشاء الطلب لأول مرة في النظام من قبل {log.adminName}
                        .
                      </div>
                    ) : log.action === "DELETE" ? (
                      <div className="mt-2 text-sm text-gray-600 font-medium italic border-r-2 border-red-200 pr-3 py-1">
                        تم نقل الطلب إلى المحذوفات.
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {logs.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdHistory size={32} />
              </div>
              <p className="text-gray-500 font-bold">
                لا يوجد سجلات تعديل متاحة لهذا الطلب حتى الآن.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
