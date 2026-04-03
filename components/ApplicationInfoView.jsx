"use client";

import React from "react";
import Link from "next/link";
import Button from "./Button";
import { MdHome, MdAddCircleOutline, MdOutlineDescription, MdPerson, MdPhone, MdSpeed, MdCalendarMonth, MdOutlineReceiptLong, MdWifi } from "react-icons/md";
import { PiSpeedometerFill } from "react-icons/pi";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { AiOutlineFieldNumber } from "react-icons/ai";
import {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  maskName,
  maskPhone,
  maskAddress,
  formatDate,
  describeSelectedInquiry,
  describeNoContractTechType,
} from "../utils/general";

const ACCENT = "#18a2e3";

const STATUS_LABELS = {
  NOT_COMPLETED: "غير مكتمل",
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  UNDER_OBSERVATION: "قيد المتابعة",
  DELAYED: "مؤجل",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 ring-1 ring-blue-200/60";
    case "COMPLETED":
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
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
      className="text-gray-800 font-semibold text-sm whitespace-pre-wrap break-words">
      {children}
    </div>
  </div>
);

const ApplicationInfoView = ({ application, loading, error }) => {
  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center p-6">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-red-600">{error || "لم يتم العثور على الطلب."}</p>
        <Link href="/internet-basvuru-formu">
          <Button variant="primary">سجل الان</Button>
        </Link>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[application.status] || application.status;
  const createdAtLabel = application.createdAt
    ? formatDate(application.createdAt)
    : "—";

  return (
    <div className="flex flex-row min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex-1 lg:w-[70%] flex flex-col min-h-svh p-6 relative py-10 shrink-0">
        <div className="max-w-3xl mx-auto space-y-8 w-full z-10 relative">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              تفاصيل الطلب
            </h1>
            <p className="text-gray-600">رقم الطلب: {application.appIndex}</p>
          </div>

          <div className="py-6 md:py-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Row label="الإسم" icon={<MdPerson size={18} />}>
                {maskName(application.name)}
              </Row>
              <Row label="رقم الموبايل" icon={<MdPhone size={18} />}>
                <span dir="ltr" className="inline-block">
                  {maskPhone(application.phone)}
                </span>
              </Row>
              <Row label="حالة الطلب" icon={<MdSpeed size={18} />}>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClass(application.status)}`}
                >
                  {statusLabel}
                </span>
              </Row>
              <Row label="تاريخ الإنشاء" icon={<MdCalendarMonth size={18} />}>
                {createdAtLabel}
              </Row>
              <Row label="هل لديك إنترنت؟" icon={<MdWifi size={18} />}>
                {application.hasInternet === "yes"
                  ? "نعم"
                  : application.hasInternet === "no"
                    ? "لا"
                    : "—"}
              </Row>
              <Row label="نوع الطلب" icon={<MdOutlineDescription size={18} />}>
                {describeServiceType(application.serviceType)}
              </Row>
              {application.serviceType === "newline" && (
                <Row label="نوع العرض" icon={<MdOutlineDescription size={18} />}>
                  {describeContractPreference(application.contractPreference)}
                </Row>
              )}
              {application.serviceType === "services" && (
                <Row label="الخدمة المختارة" icon={<MdOutlineDescription size={18} />}>
                  {describeSelectedService(application.selectedService)}
                </Row>
              )}
              {application.serviceType === "newline" &&
                application.contractPreference === "with" && (
                  <Row label="الباقة المختارة" icon={<MdSpeed size={18} />}>
                    {describeSelectedPackage(application.selectedPackage)}
                  </Row>
                )}
              {application.serviceType === "inquiry" && (
                <Row className="sm:col-span-2" label="الاستفسار" icon={<MdOutlineDescription size={18} />}>
                  {describeSelectedInquiry(application.selectedInquiry)}
                </Row>
              )}
              {
                application.serviceType === "newline" &&
                application.contractPreference === "without" &&
                (
                  <Row label="نوع التقنية" icon={<PiSpeedometerFill size={18} />}>
                    {application.noContractTechType ? describeNoContractTechType(application.noContractTechType) : "—"}
                  </Row>
                )
              }
              {
                application.serviceType === "services" && (
                  <>
                    <Row label="شركة الإنترنت" icon={<FaBuildingCircleCheck size={18} />}>
                      {application.internetCompany ? application.internetCompany : "—"}
                    </Row>
                    <Row label="رقم الإشتراك" icon={<AiOutlineFieldNumber size={18} />}>
                      {application.subscriptionNo ? application.subscriptionNo : "—"}
                    </Row>
                  </>
                )
              }
              <Row label="العنوان" dir="ltr" className="sm:col-span-2" icon={<MdHome size={18} />}>
                {maskAddress(application.address)}
              </Row>
              {application.invoiceFileUrl && application.invoiceFileUrl.trim() !== "" && (
                <Row
                  label="الصور المرفقة"
                  className="sm:col-span-2"
                  icon={<MdOutlineReceiptLong size={18} />}
                >
                  <div className="flex flex-wrap gap-3 mt-2">
                    {application.invoiceFileUrl.split(",").filter(Boolean).map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition hover:shadow-md ring-2 ring-transparent hover:ring-[#18a2e3]"
                      >
                        <img src={url} alt={`مرفق ${idx + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </Row>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-col md:flex-row">
            <Link href="/internet-basvuru-formu">
              <Button variant="secondary" size="large" className="flex w-full items-center justify-center gap-2">
                <MdAddCircleOutline size={22} />
                طلب جديد
              </Button>
            </Link>
            <Link href="/start">
              <Button variant="primary" size="large" className="flex w-full items-center justify-center gap-2">
                <MdHome size={22} />
                الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Image */}
      <div className="hidden lg:block lg:w-[30%] shrink-0">
        <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
          
          {/* Decorative touches */}
          <div className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-fade-in-up">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <MdOutlineDescription className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">تفاصيل الطلب</h3>
              <p className="text-white/80 text-sm leading-relaxed opacity-95">
                يمكنك هنا مراجعة جميع التفاصيل والمرفقات الخاصة بطلبك.
              </p>
            </div>
          </div>

          <img
            src="/contract.jpg"
            alt="Application Details"
            className="w-full h-full object-cover animate-step-in-right relative z-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfoView;
