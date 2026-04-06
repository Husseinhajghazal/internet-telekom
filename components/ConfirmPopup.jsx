import React from "react";

import { MdCancel, MdPerson, MdPhone, MdDescription, MdSpeed, MdHome, MdOutlineReceiptLong } from "react-icons/md";
import { PiSpeedometerFill } from "react-icons/pi";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { AiOutlineFieldNumber } from "react-icons/ai";
import Button from "./Button";

const ACCENT = "#18a2e3";

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

import {
  describeContractPreference,describeNoContractTechType,describeSelectedInquiry,describeSelectedPackage,describeSelectedService,describeServiceType,
} from "../utils/general"

const ConfirmPopup = ({ confirmValues, handleConfirm, handleCancel }) => {
  const isInquiry = confirmValues?.serviceType === "inquiry";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
          <div className="flex items-start justify-between gap-4">
            <div className="text-right space-y-2">
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
                تأكيد الطلب
              </h3>
              <p className="text-gray-600">تأكد من صحة المعلومات قبل الإرسال</p>
            </div>
            <Button variant="icon" onClick={handleCancel} aria-label="Close">
              <MdCancel size={24} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Row label="الإسم" icon={<MdPerson size={18} />}>
              {confirmValues?.name || "—"}
            </Row>
            <Row label="رقم الموبايل" dir="ltr" icon={<MdPhone size={18} />}>
              {confirmValues?.phone || "—"}
            </Row>
            <Row label="نوع الطلب" className="md:col-span-2" icon={<MdDescription size={18} />}>
              {describeServiceType(confirmValues?.serviceType)}
            </Row>

            {confirmValues?.serviceType === "inquiry" && (
              <Row label="نوع الاستشارة" className="md:col-span-2" icon={<MdDescription size={18} />}>
                {describeSelectedInquiry(confirmValues?.selectedInquiry)}
              </Row>
            )}

            {confirmValues?.serviceType === "newline" && (
              <Row label="نوع العرض" className="md:col-span-2" icon={<MdDescription size={18} />}>
                {describeContractPreference(confirmValues?.contractPreference)}
              </Row>
            )}

            {confirmValues?.serviceType === "services" && (
              <Row label="الخدمة المختارة" className="md:col-span-2" icon={<MdDescription size={18} />}>
                {describeSelectedService(confirmValues?.selectedService)}
              </Row>
            )}

            {confirmValues?.serviceType === "newline" && confirmValues?.contractPreference === "without" && (
              <Row label="التقنية المختارة" className="md:col-span-2" icon={<PiSpeedometerFill size={18} />}>
                {describeNoContractTechType(confirmValues?.noContractTechType)}
              </Row>
            )}

            {confirmValues?.serviceType === "services" && confirmValues?.internetCompany && (
              <Row label="شركة الإنترنت" className="md:col-span-2" icon={<FaBuildingCircleCheck size={18} />}>
                {confirmValues.internetCompany}
              </Row>
            )}

            {confirmValues?.serviceType === "services" && confirmValues?.subscriptionNo && (
              <Row label="رقم الإشتراك" className="md:col-span-2" icon={<MdOutlineReceiptLong size={18} />}>
                {confirmValues.subscriptionNo ? confirmValues.subscriptionNo : "—"}
              </Row>
            )}

            {confirmValues?.serviceType === "newline" && confirmValues?.contractPreference === "with" && (
              <Row label="الباقة المختارة" className="md:col-span-2" icon={<MdSpeed size={18} />}>
                {describeSelectedPackage(confirmValues?.selectedPackage)}
              </Row>
            )}

            {!isInquiry && (
              <Row label="العنوان" dir="ltr" className="md:col-span-2" icon={<MdHome size={18} />}>
                {confirmValues?.address || "—"}
              </Row>
            )}

            {(confirmValues?.note || "").trim() && (
              <Row label="ملاحظة" className="md:col-span-2" icon={<MdDescription size={18} />}>
                {confirmValues?.note}
              </Row>
            )}

            {!isInquiry && (() => {
              const newFiles = confirmValues?.invoiceFiles || [];
              const existingUrls = confirmValues?.invoiceFileUrls || [];
              const total = newFiles.length + existingUrls.length;
              return (
                <Row label="الصور المرفقة" className="md:col-span-2" icon={<MdOutlineReceiptLong size={18} />}>
                  {total > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {existingUrls.map((url, idx) => (
                        <img key={`saved-${idx}`} src={url} alt={`مرفق ${idx + 1}`} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                      ))}
                      {newFiles.map((file, idx) => (
                        <img key={`new-${idx}`} src={URL.createObjectURL(file)} alt={`جديد ${idx + 1}`} className="w-14 h-14 object-cover rounded-lg border-2 border-green-300" />
                      ))}
                    </div>
                  ) : "—"}
                </Row>
              );
            })()}
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCancel}
            >
              تعديل
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleConfirm}
            >
              تأكيد الطلب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
