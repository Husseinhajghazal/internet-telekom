"use client";

import React from "react";
import { ErrorMessage } from "formik";
import Card from "../Card";
import StepHeader from "../StepHeader";

const Step3 = ({ values, errors, touched, setFieldValue }) => {
  const options = [
    {
      name: "selectedService",
      value: "upgrade",
      selected:
        values.serviceType === "services" &&
        values.selectedService === "upgrade",
      icon: "/animations/no%20transactions.json",
      title: "تحويل من عقد لبدون عقد",
      description: "",
      size: "small",
      color: "indigo",
      titleSize: "text-lg",
      centerTitle: true,
      className: "md:col-span-2",
      hidden: values.hasInternet === "no",
      onClick: () => {
        setFieldValue("serviceType", "services");
        setFieldValue("selectedService", "upgrade");
        setFieldValue("contractPreference", "without");
      },
    },
    {
      name: "serviceType",
      value: "newline",
      selected: values.serviceType === "newline",
      icon: "/animations/Modem%20animation.json",
      title: "خط جديد",
      description: "طلب خط إنترنت جديد",
      size: "large",
      color: "green",
      hidden: values.hasInternet !== "no",
      onClick: () => {
        setFieldValue("serviceType", "newline");
        setFieldValue("selectedService", "");
      },
    },
    {
      name: "serviceType",
      value: "services",
      selected:
        values.serviceType === "services" &&
        values.selectedService !== "upgrade",
      icon: "/animations/Customer%20Service%20Man%20Waving%20(Mobile%20Phone%20Repair).json",
      title: "خدمات تقنية",
      description: "الخدمات المتعددة المتوفرة لدينا",
      size: "large",
      color: "blue",
      hidden: values.hasInternet === "no",
      onClick: () => {
        setFieldValue("serviceType", "services");
        setFieldValue("selectedService", "");
      },
    },
    {
      name: "serviceType",
      value: "inquiry",
      selected: values.serviceType === "inquiry",
      icon: "/animations/Consulting.json",
      title: "إستشارات",
      description: "حول الخدمات والإشتراكات",
      size: "large",
      color: "orange",
      onClick: () => {
        setFieldValue("serviceType", "inquiry");
        setFieldValue("selectedService", "");
      },
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="هل تبحث عن خدمة معينة أو خط جديد؟"
        subTitle="إختر الخيار الذي يناسبك"
      >
        {/* <LottieAnimation
          path="/animations/Thinking.json"
          width={150}
          height={150}
          className="inline-block"
        /> */}
      </StepHeader>

      <div className={`grid md:grid-cols-2 gap-3 md:gap-6 md:px-6`}>
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
              titleSize={option.titleSize}
              centerTitle={option.centerTitle}
              className={option.className}
              onClick={option.onClick}
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
