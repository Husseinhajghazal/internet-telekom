"use client";

import React from "react";
import { Field } from "formik";
import { MdPhoneInTalk } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import FormFieldBlock from "../FormFieldBlock";

const Step6 = ({ values, errors, touched, setFieldValue }) => {
  const hasSavedInvoice = Boolean(values.invoiceFileUrl);
  const hasNewInvoice = Boolean(values.invoiceFile);
  const showInvoicePreview = hasNewInvoice || hasSavedInvoice;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
      <div className="text-center space-y-3">
        <div className="text-6xl mb-4">
          <MdPhoneInTalk className="inline-block text-[#18a2e3]" size={60} />
        </div>
        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
          أكمل إدخال معلوماتك
        </h2>
        <p className="text-gray-600 md:text-lg">
          يرجى إكمال البيانات المطلوبة لمعالجة طلبك
        </p>
      </div>

      <div className="space-y-4 md:space-y-8 md:px-6">
        <FormFieldBlock
          label="العنوان"
          name="address"
          labelClassName="md:text-lg mb-4"
          errorClassName="text-red-500 text-sm text-right"
        >
          <Field
            as="textarea"
            name="address"
            id="address"
            rows={4}
            className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none ${
              errors.address && touched.address
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="أدخل عنوانك الكامل (المدينة، الحي، الشارع، رقم المبنى، إلخ)"
          />
        </FormFieldBlock>

        <FormFieldBlock
          label="ملاحظة إضافية (اختياري)"
          labelClassName="md:text-lg"
          wrapperClassName="space-y-4"
        >
          <Field
            as="textarea"
            name="note"
            id="note"
            rows={3}
            className="w-full outline-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none"
            placeholder="أي ملاحظات إضافية تريد إضافتها..."
          />
        </FormFieldBlock>

        <div className="space-y-4">
          <label className="block text-right text-gray-700 font-medium md:text-lg">
            صورة فاتورة (كهرباء، ماء، غاز، أو إنترنت)
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
              showInvoicePreview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-[#18a2e3] hover:bg-blue-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-[#18a2e3]", "bg-blue-50");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (!showInvoicePreview) {
                e.currentTarget.classList.remove(
                  "border-[#18a2e3]",
                  "bg-blue-50",
                );
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                setFieldValue("invoiceFile", file);
              }
              e.currentTarget.classList.remove(
                "border-[#18a2e3]",
                "bg-blue-50",
              );
            }}
            onClick={() => {
              if (!showInvoicePreview) {
                document.getElementById("invoice-upload").click();
              }
            }}
          >
            {hasNewInvoice ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(values.invoiceFile)}
                    alt="Invoice preview"
                    className="max-w-full max-h-32 rounded-lg shadow-md object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-green-700">
                  <p className="font-semibold">تم رفع الصورة بنجاح</p>
                  <p className="text-sm">{values.invoiceFile.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("invoiceFile", null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : hasSavedInvoice ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={values.invoiceFileUrl}
                    alt="Invoice saved"
                    className="max-w-full max-h-32 rounded-lg shadow-md object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-green-700">
                  <p className="font-semibold">صورة محفوظة مسبقاً</p>
                  <p className="text-sm break-all">{values.invoiceFileUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFieldValue("invoiceFileUrl", "")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                    <TbFileInvoiceFilled className="text-3xl text-blue-600" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full opacity-0 transition-opacity duration-300"></div>
                </div>
                <div className="text-gray-600">
                  <p className="font-semibold text-lg">اسحب وأفلت الصورة هنا</p>
                  <p className="text-sm">أو انقر لاختيار الملف</p>
                </div>
                <input
                  type="file"
                  name="invoiceFile"
                  accept="image/*"
                  className="hidden"
                  id="invoice-upload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFieldValue("invoiceFile", file);
                      setFieldValue("invoiceFileUrl", "");
                    }
                  }}
                />
                {/* <label
                  htmlFor="invoice-upload"
                  className="inline-block px-8 py-3 bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white rounded-lg cursor-pointer hover:from-[#0d8bc9] hover:to-[#18a2e3] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  اختر الصورة
                </label> */}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-right">
            يرجى رفع صورة واضحة لفاتورتك (PNG, JPG, JPEG - حد أقصى 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step6;
