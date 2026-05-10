"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdCalendarMonth,
  MdCancel,
  MdContentCopy,
  MdDescription,
  MdDone,
  MdHome,
  MdOutlineReceiptLong,
  MdPerson,
  MdPhone,
  MdSpeed,
  MdUpdate,
  MdWifi,
  MdOutlinePinDrop,
} from "react-icons/md";
import { FaBuildingCircleCheck, FaIdCard } from "react-icons/fa6";
import { PiSpeedometerFill } from "react-icons/pi";
import Button from "../Button";
import {
  describeContractPreference,
  describeNoContractTechType,
  describeSelectedInquiry,
  describeSelectedPackage,
  describeSelectedService,
  describeServiceType,
  formatDate,
  describeStatus,
  statusBadgeClass,
} from "../../utils/general";

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

export default function ApplicationDetailModal({
  application,
  onClose,
  isDeletedMode,
}) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState(null);

  const copyText = (value, field) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyPhone = (value, field) => {
    const digits = (value || "").replace(/\D/g, "").replace(/^0/, "");
    if (!digits) return;
    navigator.clipboard.writeText(digits);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyBtn = ({ field, onCopy }) => (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors shrink-0"
      title="نسخ"
    >
      {copiedField === field ? (
        <MdDone size={15} className="text-emerald-500" />
      ) : (
        <MdContentCopy size={15} />
      )}
    </button>
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!application) return null;

  const createdAtLabel = application.createdAt
    ? formatDate(application.createdAt)
    : "—";
  const completedAtLabel = application.completedAt
    ? formatDate(application.completedAt)
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
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
              تفاصيل الطلب
            </div>
            <h2
              id="detail-title"
              className="text-xl md:text-2xl font-extrabold tracking-tight"
            >
              #{application.appIndex}
            </h2>
            <p className="text-sm text-white/85">عرض كامل للبيانات المسجّلة</p>
          </div>
          <Button
            variant="icon"
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="text-white! hover:bg-white/15! shrink-0"
          >
            <MdCancel size={26} />
          </Button>
        </div>

        <div className="overflow-y-auto p-4 md:p-6 space-y-4 bg-linear-to-b from-slate-50/50 to-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Row
              label={application.newName ? "الإسم واللقب القديم" : "الإسم"}
              icon={<MdPerson size={18} />}
            >
              <div className="flex items-center gap-2">
                <span className="flex-1">{application.name}</span>
                <CopyBtn
                  field="name"
                  onCopy={() => copyText(application.name, "name")}
                />
              </div>
            </Row>

            {application.newName && (
              <Row label="الإسم واللقب الجديد" icon={<MdPerson size={18} />}>
                <div className="flex items-center gap-2">
                  <span className="flex-1">{application.newName}</span>
                  <CopyBtn
                    field="newName"
                    onCopy={() => copyText(application.newName, "newName")}
                  />
                </div>
              </Row>
            )}

            <Row
              label={
                application.newName
                  ? "الرقم الوطني القديم (TC)"
                  : "الرقم الوطني (TC)"
              }
              icon={<FaIdCard size={18} />}
            >
              {application.nationalNumber ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1">{application.nationalNumber}</span>
                  <CopyBtn
                    field="nationalNumber"
                    onCopy={() =>
                      copyText(application.nationalNumber, "nationalNumber")
                    }
                  />
                </div>
              ) : (
                "—"
              )}
            </Row>

            {application.newNationalNumber && (
              <Row
                label="الرقم الوطني الجديد (TC)"
                icon={<FaIdCard size={18} />}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1">
                    {application.newNationalNumber}
                  </span>
                  <CopyBtn
                    field="newNationalNumber"
                    onCopy={() =>
                      copyText(
                        application.newNationalNumber,
                        "newNationalNumber",
                      )
                    }
                  />
                </div>
              </Row>
            )}

            <Row label="المواليد" icon={<MdCalendarMonth size={18} />}>
              {application.birthDate
                ? application.birthDate.includes("-")
                  ? formatDate(application.birthDate, "1").replaceAll(".", "/")
                  : application.birthDate
                : "—"}
            </Row>

            <Row
              label={
                application.newName ? "رقم الموبايل القديم" : "رقم الموبايل"
              }
              icon={<MdPhone size={18} />}
            >
              <div className="flex items-center gap-2">
                <span dir="ltr" className="inline-block flex-1">
                  {application.phone}
                </span>
                <CopyBtn
                  field="phone"
                  onCopy={() => copyPhone(application.phone, "phone")}
                />
              </div>
            </Row>

            {application.newPhone && (
              <Row label="رقم الموبايل الجديد" icon={<MdPhone size={18} />}>
                <div className="flex items-center gap-2">
                  <span dir="ltr" className="inline-block flex-1">
                    {application.newPhone}
                  </span>
                  <CopyBtn
                    field="newPhone"
                    onCopy={() => copyPhone(application.newPhone, "newPhone")}
                  />
                </div>
              </Row>
            )}

            <Row label="رقم الموبايل 2" icon={<MdPhone size={18} />}>
              {application.phone2 ? (
                <div className="flex items-center gap-2">
                  <span dir="ltr" className="inline-block flex-1">
                    {application.phone2}
                  </span>
                  <CopyBtn
                    field="phone2"
                    onCopy={() => copyPhone(application.phone2, "phone2")}
                  />
                </div>
              ) : (
                "—"
              )}
            </Row>
            <Row label="حالة الطلب" icon={<MdSpeed size={18} />}>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(application.status)}`}
              >
                {describeStatus(application.status)}
              </span>
            </Row>
            {application.status === "DELAYED" && application.delayedUntil && (
              <Row label="تاريخ التأجيل" icon={<MdCalendarMonth size={18} />}>
                <span className="inline-flex items-center gap-1.5 text-orange-700 font-bold">
                  {formatDate(application.delayedUntil, "1")}
                </span>
              </Row>
            )}
            <Row label="تاريخ التسجيل" icon={<MdCalendarMonth size={18} />}>
              {createdAtLabel}
            </Row>
            <Row label="تاريخ التفعيل" icon={<MdUpdate size={18} />}>
              {completedAtLabel}
            </Row>
            <Row label="نوع الطلب" icon={<MdDescription size={18} />}>
              {describeServiceType(
                application.serviceType,
                application.selectedService,
              )}
            </Row>
            {application.serviceType === "newline" && (
              <Row label="نوع العقد" icon={<MdDescription size={18} />}>
                {describeContractPreference(application.contractPreference)}
              </Row>
            )}
            {application.serviceType === "services" && (
              <Row label="الخدمة المختارة" icon={<MdDescription size={18} />}>
                {describeSelectedService(application.selectedService)}
              </Row>
            )}
            {application.serviceType === "newline" &&
              application.contractPreference === "with" && (
                <Row label="الباقة المختارة" icon={<MdSpeed size={18} />}>
                  {describeSelectedPackage(application.selectedPackage)}
                </Row>
              )}
            {((application.serviceType === "newline" &&
              application.contractPreference === "without") ||
              (application.serviceType === "services" &&
                application.selectedService === "upgrade")) && (
              <Row label="نوع التقنية" icon={<PiSpeedometerFill size={18} />}>
                {application.noContractTechType
                  ? describeNoContractTechType(application.noContractTechType)
                  : "—"}
              </Row>
            )}
            {application.serviceType === "inquiry" && (
              <Row label="الاستفسار" icon={<MdDescription size={18} />}>
                {describeSelectedInquiry(application.selectedInquiry)}
              </Row>
            )}
            <Row
              label="شركة الإنترنت"
              icon={<FaBuildingCircleCheck size={18} />}
            >
              {application.internetCompany ? application.internetCompany : "—"}
            </Row>
            <Row label="رقم الإشتراك" icon={<MdOutlineReceiptLong size={18} />}>
              {application.subscriptionNo ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1">{application.subscriptionNo}</span>
                  <CopyBtn
                    field="subscriptionNo"
                    onCopy={() =>
                      copyText(application.subscriptionNo, "subscriptionNo")
                    }
                  />
                </div>
              ) : (
                "—"
              )}
            </Row>
            {application.serviceType === "services" && (
              <Row
                label="قيمة أخر فاتورة"
                icon={<MdOutlineReceiptLong size={18} />}
              >
                {application.lastInvoiceAmount ? (
                  <div className="flex items-center gap-2">
                    <span className="flex-1">
                      {application.lastInvoiceAmount}
                    </span>
                    <CopyBtn
                      field="lastInvoiceAmount"
                      onCopy={() =>
                        copyText(
                          application.lastInvoiceAmount,
                          "lastInvoiceAmount",
                        )
                      }
                    />
                  </div>
                ) : (
                  "—"
                )}
              </Row>
            )}
            <Row
              label={
                application.selectedService === "transfer-address"
                  ? "كود العنوان الحالي (BBK)"
                  : "كود العنوان (BBK)"
              }
              icon={<MdOutlinePinDrop size={18} />}
            >
              {application.addressCode ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1">{application.addressCode}</span>
                  <CopyBtn
                    field="addressCode"
                    onCopy={() =>
                      copyText(application.addressCode, "addressCode")
                    }
                  />
                </div>
              ) : (
                "—"
              )}
            </Row>
            <Row label="نوع العنوان" icon={<MdHome size={18} />}>
              {application.originalAddress ? "الأساسي" : "مجاور"}
            </Row>
            {!application.originalAddress &&
              application.originalAddressText && (
                <Row label="العنوان الأساسي" icon={<MdHome size={18} />}>
                  <div className="flex items-center gap-2">
                    <span className="flex-1">
                      {application.originalAddressText}
                    </span>
                    <CopyBtn
                      field="originalAddressText"
                      onCopy={() =>
                        copyText(
                          application.originalAddressText,
                          "originalAddressText",
                        )
                      }
                    />
                  </div>
                </Row>
              )}
            <Row
              label={
                application.selectedService === "transfer-address"
                  ? "العنوان الحالي"
                  : "العنوان"
              }
              dir="ltr"
              className="sm:col-span-2"
              icon={<MdHome size={18} />}
            >
              {application.address ? (
                <div className="flex items-start gap-2">
                  <span className="flex-1">{application.address}</span>
                  <CopyBtn
                    field="address"
                    onCopy={() => copyText(application.address, "address")}
                  />
                </div>
              ) : (
                "—"
              )}
            </Row>

            {application.selectedService === "transfer-address" && (
              <>
                <Row
                  label="كود العنوان الجديد (BBK)"
                  icon={<MdOutlinePinDrop size={18} />}
                >
                  {application.newAddressCode
                    ? application.newAddressCode
                    : "—"}
                </Row>
                <Row label="نوع العنوان الجديد" icon={<MdHome size={18} />}>
                  {application.newOriginalAddress ? "الأساسي" : "مجاور"}
                </Row>
                {!application.newOriginalAddress &&
                  application.newOriginalAddressText && (
                    <Row
                      label="العنوان الأساسي الجديد"
                      icon={<MdHome size={18} />}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-1">
                          {application.newOriginalAddressText}
                        </span>
                        <CopyBtn
                          field="newOriginalAddressText"
                          onCopy={() =>
                            copyText(
                              application.newOriginalAddressText,
                              "newOriginalAddressText",
                            )
                          }
                        />
                      </div>
                    </Row>
                  )}
                <Row
                  label="العنوان الجديد"
                  dir="ltr"
                  className="sm:col-span-2"
                  icon={<MdHome size={18} />}
                >
                  {application.newAddress ? (
                    <div className="flex items-start gap-2">
                      <span className="flex-1">{application.newAddress}</span>
                      <CopyBtn
                        field="newAddress"
                        onCopy={() =>
                          copyText(application.newAddress, "newAddress")
                        }
                      />
                    </div>
                  ) : (
                    "—"
                  )}
                </Row>
              </>
            )}
            {(application.note || "").trim() ? (
              <Row
                label="ملاحظة"
                className="sm:col-span-2"
                icon={<MdDescription size={18} />}
              >
                {application.note}
              </Row>
            ) : null}

            {(application.serviceType === "services" ||
              (application.serviceType === "newline" &&
                application.contractPreference === "without")) && (
              <>
                {(application.serviceType === "newline" ||
                  application.selectedService === "upgrade") && (
                  <>
                    <Row
                      label="موافقة الكترونية"
                      icon={<MdDescription size={18} />}
                    >
                      {application.electronicApproval ? "نعم" : "لا"}
                    </Row>
                    <Row
                      label="موافقة عبر الشحن"
                      icon={<MdDescription size={18} />}
                    >
                      {application.approvalViaShipping ? "نعم" : "لا"}
                    </Row>
                  </>
                )}
                <Row
                  label={`مدفوع من ${application.name}`}
                  icon={<MdDescription size={18} />}
                >
                  {application.paidByUserName ? "نعم" : "لا"}
                </Row>
                {!application.paidByUserName && (
                  <Row label="إسم الدافع" icon={<MdPerson size={18} />}>
                    {application.paidByName || "—"}
                  </Row>
                )}
                {(application.serviceType === "newline" ||
                  application.selectedService === "upgrade") && (
                  <Row
                    label="عدد الخصومات"
                    icon={<MdOutlineReceiptLong size={18} />}
                  >
                    {application.discountCount || "—"}
                  </Row>
                )}
              </>
            )}

            <Row
              label="الصور المرفقة"
              className="sm:col-span-2"
              icon={<MdOutlineReceiptLong size={18} />}
            >
              {application.invoiceFileUrl &&
              application.invoiceFileUrl.trim() !== "" ? (
                <div className="flex flex-wrap gap-3 mt-2">
                  {application.invoiceFileUrl
                    .split(",")
                    .filter(Boolean)
                    .map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition hover:shadow-md ring-2 ring-transparent hover:ring-[#18a2e3]"
                      >
                        <img
                          src={url}
                          alt={`مرفق ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                </div>
              ) : (
                "—"
              )}
            </Row>

            {application.createdBy && (
              <Row
                label="من الذي سجل الطلب"
                icon={<MdPerson size={18} />}
                className="sm:col-span-2"
              >
                <span className="font-bold text-indigo-800">
                  {application.createdBy}
                </span>
              </Row>
            )}

            {application.lastUpdatedBy && (
              <Row
                label="أخر تحديث بواسطة"
                icon={<MdPerson size={18} />}
                className="sm:col-span-2"
              >
                <span className="font-bold text-cyan-800">
                  {application.lastUpdatedBy}
                </span>
              </Row>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/90 flex gap-2 justify-center">
          <Button
            variant="primary"
            type="button"
            onClick={onClose}
            className="rounded-xl! min-w-30"
          >
            اغلاق
          </Button>
          {!isDeletedMode && (
            <Button
              variant="secondary"
              type="button"
              onClick={() =>
                router.push(`/panel/applications/${application.id}/edit`)
              }
              className="rounded-xl! min-w-30"
            >
              تحرير
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
