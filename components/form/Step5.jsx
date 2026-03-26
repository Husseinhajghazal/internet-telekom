"use client";

import React from "react";
import { ErrorMessage } from "formik";
import PackageSection from "../PackageSection";

const Step5 = ({
  values,
  errors,
  touched,
  familyContractDuration,
  vipContractDuration,
  setFamilyContractDuration,
  setVipContractDuration,
  setFieldValue,
}) => {
  const familySpeeds = ["16", "24", "50", "100"];
  const vipSpeeds = ["16", "24", "50", "100", "200", "500", "1000"];
  const updateDuration = (kind, currentDuration, nextDuration, setDuration) => {
    if (currentDuration === nextDuration) return;
    const current = values.selectedPackage || "";

    setDuration(nextDuration);
    const pattern = kind === "family" ? /^family-(18|24)-(.+)$/ : /^vip-(12|18)-(.+)$/;
    const match = current.match(pattern);
    if (match) {
      setFieldValue("selectedPackage", `${kind}-${nextDuration}-${match[2]}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <div className="space-y-16 md:px-6">
        <PackageSection
          accent="blue"
          title="الباقات العائلية المخفضة"
          description="باقات مصممة خصيصاً للعائلات مع أسعار مخفضة وخدمات شاملة"
          durationLabel={familyContractDuration === "18" ? "18 شهر" : "سنتين"}
          durations={[
            { value: "18", label: "18 شهر" },
            { value: "24", label: "سنتين" },
          ]}
          selectedDuration={familyContractDuration}
          onDurationChange={(nextDuration) =>
            updateDuration(
              "family",
              familyContractDuration,
              nextDuration,
              setFamilyContractDuration,
            )
          }
          speeds={familySpeeds}
          packageKind="family"
          selectedPackage={values.selectedPackage}
        />

        <PackageSection
          accent="purple"
          title="باقات الإنترنت VIP"
          description="باقات متميزة للمستخدمين المتقدمين مع سرعات عالية وجودة فائقة"
          durationLabel={vipContractDuration === "12" ? "سنة" : "18 شهر"}
          durations={[
            { value: "12", label: "سنة" },
            { value: "18", label: "18 شهر" },
          ]}
          selectedDuration={vipContractDuration}
          onDurationChange={(nextDuration) =>
            updateDuration("vip", vipContractDuration, nextDuration, setVipContractDuration)
          }
          speeds={vipSpeeds}
          packageKind="vip"
          selectedPackage={values.selectedPackage}
        />
      </div>

      {errors.selectedPackage && touched.selectedPackage && (
        <ErrorMessage
          name="selectedPackage"
          component="div"
          className="text-red-500 text-center font-medium"
        />
      )}
    </div>
  );
};

export default Step5;
