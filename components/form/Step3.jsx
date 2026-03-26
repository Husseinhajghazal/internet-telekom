"use client";

import React from "react";
import { ErrorMessage } from "formik";
import Card from "../Card";
import StepHeader from "../StepHeader";
import LottieAnimation from "../LottieAnimation";

const Step3 = ({ values, errors, touched }) => {
  const options = [
    {
      name: "serviceType",
      value: "newline",
      selected: values.serviceType === "newline",
      icon: '/animations/route.json',
      title: "خط جديد",
      description: "طلب خط انترنت جديد",
      size: "large",
      color: "green",
      hidden: values.hasInternet !== "no",
    },
    {
      name: "serviceType",
      value: "services",
      selected: values.serviceType === "services",
      icon: '/animations/Customer%20Service%20Man%20Waving%20(Mobile%20Phone%20Repair).json',
      title: "خدمات",
      description: "معرفة الخدمات المتاحة لديك",
      size: "large",
      color: "blue",
      hidden: values.hasInternet === "no",
    },
    {
      name: "serviceType",
      value: "inquiry",
      selected: values.serviceType === "inquiry",
      icon: "/animations/Consulting.json",
      title: "استشارات",
      description: "حول الخدمات والاشتراكات",
      size: "large",
      color: "orange",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="هل تبحث عن خدمة معينة أو خط جديد؟"
        subTitle="اختر الخيار الذي يناسبك"
      >
        <LottieAnimation
          path="/animations/Thinking.json"
          width={150}
          height={150}
          className="inline-block"
        />
      </StepHeader>

      <div
        className={`grid gap-3 md:gap-6 justify-center md:px-6 grid-cols-2`}
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
