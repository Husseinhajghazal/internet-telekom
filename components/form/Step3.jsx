"use client";

import React from "react";
import { ErrorMessage } from "formik";
import { GiWifiRouter } from "react-icons/gi";
import { LuPackageSearch } from "react-icons/lu";
import { RiCustomerService2Line } from "react-icons/ri";
import { BiHelpCircle } from "react-icons/bi";
import Card from "../Card";
import StepHeader from "../StepHeader";
const Step3 = ({ values, errors, touched }) => {
  const options = [
    {
      name: "serviceType",
      value: "newline",
      selected: values.serviceType === "newline",
      icon: GiWifiRouter,
      title: "خط جديد",
      description: "طلب خط انترنت جديد",
      size: "large",
      color: "green",
      className: "col-span-2 md:col-span-1",
      hidden: values.hasInternet !== "no",
    },
    {
      name: "serviceType",
      value: "services",
      selected: values.serviceType === "services",
      icon: LuPackageSearch,
      title: "خدمات",
      description: "معرفة الخدمات المتاحة لديك",
      size: "large",
      color: "blue",
    },
    {
      name: "serviceType",
      value: "inquiry",
      selected: values.serviceType === "inquiry",
      icon: RiCustomerService2Line,
      title: "استعلام",
      description: "الاستعلام عن الاشتراك الحالي",
      size: "large",
      color: "purple",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
      <StepHeader
        title="هل تبحث عن خدمة معينة أو خط جديد؟"
        subTitle="اختر الخيار الذي يناسبك"
      >
        <BiHelpCircle className="inline-block text-[#18a2e3]" size={60} />
      </StepHeader>

      <div
        className={`grid gap-3 md:gap-6 justify-center md:px-6 grid-cols-2 ${
          values.hasInternet === "no" ? "md:grid-cols-3" : ""
        }`}
      >
        {options
          .filter((option) => option.hidden !== true)
          .map((option) => (
            <Card
              key={`${option.name}-${option.value}`}
              name={option.name}
              value={option.value}
              selected={option.selected}
              icon={option.icon}
              title={option.title}
              description={option.description}
              size={option.size}
              color={option.color}
              className={option.className}
            />
          ))}
      </div>

      {errors.serviceType && touched.serviceType && (
        <ErrorMessage
          name="serviceType"
          component="div"
          className="text-red-500 text-center font-medium"
        />
      )}
    </div>
  );
};

export default Step3;
