"use client";

import React from "react";
import { Field } from "formik";
import FormFieldBlock from "../FormFieldBlock";

const Step1 = ({ errors, touched, handlePhoneChange, setFieldValue, onClearStep1Error }) => {
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

      <FormFieldBlock label="رقم الهاتف" name="phone" hint="أدخل رقم هاتفك التركي">
        <Field
          type="tel"
          name="phone"
          id="phone"
          className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
            errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="+90 (XXX) XXX XX XX"
          onChange={(e) => handlePhoneChange(e, setFieldValue)}
          style={{ direction: "ltr" }}
        />
      </FormFieldBlock>
    </div>
  );
};

export default Step1;
