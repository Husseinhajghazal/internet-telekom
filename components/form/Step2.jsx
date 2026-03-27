"use client";

import React from "react";
import { ErrorMessage } from "formik";
import Card from "../Card";
import StepHeader from "../StepHeader";
import LottieAnimation from "../LottieAnimation";

const Step2 = ({ values, errors, touched }) => {
  const options = [
    {
      name: "hasInternet",
      value: "no",
      selected: values.hasInternet === "no",
      icon: "/animations/No%20Internet%20Connection.json",
      title: "لا أملك خط انترنت",
      description: "أريد تسجيل طلب جديد",
      size: "large",
      color: "red",
    },
    {
      name: "hasInternet",
      value: "yes",
      selected: values.hasInternet === "yes",
      icon: "/animations/Wifi%20on.json",
      title: "نعم أملك خط انترنت",
      description: "اريد تقديم خدمة او طلب استشارة",
      size: "large",
      color: "green",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="هل لديك خط إنترنت؟"
        subTitle="هذا سيساعدنا على تقديم أفضل خدمة لك"
      >
        <LottieAnimation
          path="/animations/WiFi%20Connecting.json"
          width={150}
          height={150}
          className="inline-block"
        />
      </StepHeader>

      <div className="grid md:grid-cols-2 gap-3 md:gap-6 md:px-6">
        {options.map((option) => (
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
          />
        ))}
      </div>

      {errors.hasInternet && touched.hasInternet && (
        <ErrorMessage
          name="hasInternet"
          component="div"
          className="text-red-500 text-center font-medium"
        />
      )}
    </div>
  );
};

export default Step2;
