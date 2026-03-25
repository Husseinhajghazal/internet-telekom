"use client";

import React from "react";
import { Field } from "formik";
import FormFieldBlock from "../FormFieldBlock";

const Step1 = ({
  values,
  errors,
  touched,
  handlePhoneChange,
  setFieldValue,
  onClearStep1Error,
  onOpenUserAgreement,
}) => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <FormFieldBlock label="الاسم الكامل" name="name">
        <Field
          type="text"
          name="name"
          id="name"
          className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
            errors.name && touched.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="أدخل اسمك الكامل"
          onChange={(e) => {
            setFieldValue("name", e.target.value);
            onClearStep1Error?.();
          }}
        />
      </FormFieldBlock>

      <FormFieldBlock
        label="رقم الهاتف"
        name="phone"
        hint="أدخل رقم هاتفك التركي"
      >
        <Field
          type="tel"
          name="phone"
          id="phone"
          className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
            errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0 (538) 734 58 20"
          onChange={(e) => handlePhoneChange(e, setFieldValue)}
          style={{ direction: "ltr" }}
        />
      </FormFieldBlock>

      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <span className="text-sm text-gray-700 leading-6">
            أوافق على{" "}
            <button
              type="button"
              onClick={onOpenUserAgreement}
              className="text-[#18a2e3] font-semibold underline underline-offset-2 hover:text-[#0d8bc9]"
            >
              اتفاقية المستخدم
            </button>
          </span>
          <Field
            type="checkbox"
            name="userAgreementAccepted"
            checked={values.userAgreementAccepted}
            onChange={(e) => {
              setFieldValue("userAgreementAccepted", e.target.checked);
              onClearStep1Error?.();
            }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#18a2e3] focus:ring-[#18a2e3]"
          />
        </label>
        {errors.userAgreementAccepted && touched.userAgreementAccepted && (
          <p className="text-red-500 text-sm text-right">
            {errors.userAgreementAccepted}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step1;
