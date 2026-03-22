"use client";

import React from "react";
import Link from "next/link";
import Button from "./Button";
import {
  describeContractPreference,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
} from "../utils/general";

const ACCENT = "#18a2e3";

const STATUS_LABELS = {
  NOT_COMPLETED: "غير مكتمل",
  UNDER_REVIEW: "قيد المراجعة",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/60";
    case "REJECTED":
      return "bg-red-100 text-red-800 ring-1 ring-red-200/60";
    case "UNDER_REVIEW":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200/60";
    case "NOT_COMPLETED":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/60";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Row = ({ label, children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-200 p-4 text-right space-y-2 ${className}`}>
    <div className="text-sm text-gray-500 font-bold">{label}</div>
    <div className="text-gray-800 font-semibold whitespace-pre-wrap">{children}</div>
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
        <Link href="/apply">
          <Button variant="primary">العودة للطلب</Button>
        </Link>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[application.status] || application.status;
  const createdAtLabel = application.createdAt
    ? new Date(application.createdAt).toLocaleString("ar-SA")
    : "—";

  return (
    <div className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">تفاصيل الطلب</h1>
          <p className="text-gray-600">رقم الطلب: #{application.appCode}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Row label="الاسم">{application.name || "—"}</Row>
            <Row label="رقم الهاتف">
              <span dir="ltr" className="inline-block">
                {application.phone || "—"}
              </span>
            </Row>
            <Row label="حالة الطلب">
              <span className={`px-3 py-1 rounded-full text-sm ${statusBadgeClass(application.status)}`}>
                {statusLabel}
              </span>
            </Row>
            <Row label="تاريخ الإنشاء">{createdAtLabel}</Row>
            <Row label="هل لديك إنترنت؟">
              {application.hasInternet === "yes"
                ? "نعم"
                : application.hasInternet === "no"
                  ? "لا"
                  : "—"}
            </Row>
            <Row label="نوع الطلب">{describeServiceType(application.serviceType)}</Row>
            {application.serviceType === "newline" && (
              <Row label="نوع العروض">
                {describeContractPreference(application.contractPreference)}
              </Row>
            )}
            {application.serviceType === "services" && (
              <Row label="الخدمة المختارة">
                {describeSelectedService(application.selectedService)}
              </Row>
            )}
            {application.serviceType === "newline" &&
              application.contractPreference === "with" && (
                <Row label="الباقة المختارة">
                  {describeSelectedPackage(application.selectedPackage)}
                </Row>
              )}
            <Row label="العنوان" className="md:col-span-2">
              {application.address || "—"}
            </Row>
            {(application.note || "").trim() ? (
              <Row label="ملاحظة" className="md:col-span-2">
                {application.note}
              </Row>
            ) : null}
            <Row label="صورة الفاتورة" className="md:col-span-2">
              {application.invoiceFileUrl ? (
                <a
                  href={application.invoiceFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold underline break-all text-sm"
                  style={{ color: ACCENT }}
                >
                  فتح / عرض الصورة
                </a>
              ) : (
                "—"
              )}
            </Row>
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/apply">
            <Button variant="secondary" size="large">
              طلب جديد
            </Button>
          </Link>
          <Link href="/">
            <Button variant="primary" size="large">
              الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfoView;
