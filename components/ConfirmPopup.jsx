import React from "react";

import { MdCancel } from "react-icons/md";
import Button from "./Button";

import {
  describeContractPreference,describeSelectedPackage,describeSelectedService,describeServiceType
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
            <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2">
              <div className="text-sm text-gray-500 font-bold">الاسم</div>
              <div className="text-gray-800 font-semibold">
                {confirmValues?.name || "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2">
              <div className="text-sm text-gray-500 font-bold">رقم الهاتف</div>
              <div
                style={{ direction: "ltr" }}
                className="text-gray-800 font-semibold"
              >
                {confirmValues?.phone || "—"}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
              <div className="text-sm text-gray-500 font-bold">نوع الطلب</div>
              <div className="text-gray-800 font-semibold">
                {describeServiceType(confirmValues?.serviceType)}
              </div>
            </div>

            {confirmValues?.serviceType === "newline" && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">
                  نوع العروض
                </div>
                <div className="text-gray-800 font-semibold">
                  {describeContractPreference(
                    confirmValues?.contractPreference,
                  )}
                </div>
              </div>
            )}

            {confirmValues?.serviceType === "services" && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">
                  الخدمة المختارة
                </div>
                <div className="text-gray-800 font-semibold">
                  {describeSelectedService(confirmValues?.selectedService)}
                </div>
              </div>
            )}

            {confirmValues?.serviceType === "newline" &&
              confirmValues?.contractPreference === "with" && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">
                  الباقة المختارة
                </div>
                <div className="text-gray-800 font-semibold">
                  {describeSelectedPackage(confirmValues?.selectedPackage)}
                </div>
              </div>
            )}

            {!isInquiry && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">العنوان</div>
                <div className="text-gray-800 font-semibold whitespace-pre-wrap">
                  {confirmValues?.address || "—"}
                </div>
              </div>
            )}

            {(confirmValues?.note || "").trim() && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">ملاحظة</div>
                <div className="text-gray-800 font-semibold whitespace-pre-wrap">
                  {confirmValues?.note}
                </div>
              </div>
            )}

            {!isInquiry && (
              <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                <div className="text-sm text-gray-500 font-bold">
                  صورة الفاتورة
                </div>
                <div className="text-gray-800 font-semibold break-all">
                  {confirmValues?.invoiceFile?.name ||
                    confirmValues?.invoiceFileUrl ||
                    "—"}
                </div>
              </div>
            )}
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
