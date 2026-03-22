"use client";

import React from "react";
import { ErrorMessage } from "formik";
import { MdWifiOff, MdWifi } from "react-icons/md";
import Card from "../Card";
import StepHeader from "../StepHeader";

const Step2 = ({ values, errors, touched }) => {
  const options = [
    {
      name: "hasInternet",
      value: "no",
      selected: values.hasInternet === "no",
      icon: MdWifiOff,
      title: "لا",
      description: "لا أملك خط انترنت حالياً",
      size: "large",
      color: "red",
    },
    {
      name: "hasInternet",
      value: "yes",
      selected: values.hasInternet === "yes",
      icon: MdWifi,
      title: "نعم",
      description: "أملك خط انترنت بالفعل",
      size: "large",
      color: "green",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
      <StepHeader
        title="هل لديك خط إنترنت؟"
        subTitle="هذا سيساعدنا على تقديم أفضل خدمة لك"
      >
        <MdWifi className="inline-block text-[#18a2e3]" size={60} />
      </StepHeader>

      <div className="grid grid-cols-2 gap-3 md:gap-6 md:px-6">
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
