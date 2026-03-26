"use client";

import React from "react";
import { ErrorMessage } from "formik";
import {
  MdCancel,
  MdPerson,
  MdLocationOn,
  MdRefresh,
  MdAcUnit,
  MdUpgrade,
} from "react-icons/md";
import Card from "../Card";
import StepHeader from "../StepHeader";
import LottieAnimation from "../LottieAnimation";

const Step4 = ({ values, errors, touched }) => {
  const showServiceCards = values.serviceType === "services";
  const showContractCards = values.serviceType === "newline";
  const errorName = showServiceCards ? "selectedService" : "contractPreference";
  const showError = Boolean(
    (errors.selectedService && touched.selectedService) ||
    (errors.contractPreference && touched.contractPreference),
  );

  const options = [
    {
      name: "selectedService",
      value: "cancel",
      selected: values.selectedService === "cancel",
      icon: '/animations/Cross,%20Close,%20Cancel%20Icon%20Animation.json',
      title: "إبطال خط الإنترنت",
      description: "",
      size: "small",
      color: "red",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "selectedService",
      value: "transfer-name",
      selected: values.selectedService === "transfer-name",
      icon: '/animations/Photo%20ID%20Scan%20loader.json',
      title: "نقل ملكية خط الإنترنت",
      description: "",
      size: "small",
      color: "purple",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "selectedService",
      value: "transfer-address",
      selected: values.selectedService === "transfer-address",
      icon: '/animations/Address.json',
      title: "نقل خط الإنترنت لعنوان آخر",
      description: "",
      size: "small",
      color: "green",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "selectedService",
      value: "renew",
      selected: values.selectedService === "renew",
      icon: "/animations/Sign%20contract%20-%20contract%20approved.json",
      title: "تجديد عقد خط الإنترنت",
      description: "",
      size: "small",
      color: "orange",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "selectedService",
      value: "freeze",
      selected: values.selectedService === "freeze",
      icon: "/animations/Snowflake%20loading%20screen.json",
      title: "تجميد خط الإنترنت",
      description: "",
      size: "small",
      color: "blue",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "selectedService",
      value: "upgrade",
      selected: values.selectedService === "upgrade",
      icon: "/animations/Update%20app.json",
      title: "تحديث الخدمة الحالية",
      description: "",
      size: "small",
      color: "indigo",
      titleSize: "text-lg",
      centerTitle: true,
      hidden: !showServiceCards,
    },
    {
      name: "contractPreference",
      value: "with",
      selected: values.contractPreference === "with",
      icon: "/animations/Contract%20Sign.json",
      title: "مع عقد",
      description: "عروض حصرية مع عقد اشتراك",
      size: "large",
      color: "green",
      titleSize: "text-xl",
      hidden: !showContractCards,
    },
    {
      name: "contractPreference",
      value: "without",
      selected: values.contractPreference === "without",
      icon: "/animations/no%20transactions.json",
      title: "بدون عقد",
      description: "سرعات متنوعة بدون التزام عقد",
      size: "large",
      color: "blue",
      titleSize: "text-xl",
      hidden: !showContractCards,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title={showServiceCards ? "اختر الخدمة المناسبة لك" : "اختر نوع العرض"}
        subTitle={
          showServiceCards
            ? "اختر من القائمة التالية"
            : "هل تفضل عروض مع عقد أم بدون عقد؟"
        }
      >
        <LottieAnimation
          path="/animations/Thinking.json"
          width={150}
          height={150}
          className="inline-block"
        />
      </StepHeader>

      <div className="grid md:grid-cols-2 gap-3 md:gap-6 md:px-6">
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
            />
          ))}
      </div>

      {showError ? (
        <ErrorMessage
          name={errorName}
          component="div"
          className="text-red-500 text-center font-medium"
        />
      ) : null}
    </div>
  );
};

export default Step4;
