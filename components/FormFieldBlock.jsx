"use client";

import React from "react";
import { ErrorMessage } from "formik";

const FormFieldBlock = ({
  label,
  name,
  hint,
  children,
  labelClassName = "",
  errorClassName = "text-red-500 text-sm mt-1 text-right",
  wrapperClassName = "",
}) => {
  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={name}
        className={`block text-right text-gray-700 font-medium mb-2 ${labelClassName}`}
      >
        {label}
      </label>
      {children}
      {name ? (
        <ErrorMessage name={name} component="div" className={errorClassName} />
      ) : null}
      {hint ? <p className="text-sm text-gray-500 mt-1 text-right">{hint}</p> : null}
    </div>
  );
};

export default FormFieldBlock;
