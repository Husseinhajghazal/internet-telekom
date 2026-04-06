"use client";

import React from "react";
import { ErrorMessage } from "formik";
import PackageSection from "../PackageSection";
import TechTypeGrid from "../TechTypeGrid";
import StepHeader from "../StepHeader";

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
  const isWithContract = values.contractPreference === "with";

  const familySpeeds = ["16", "24", "50", "100"];
  const vipSpeeds = ["16", "24", "50", "100", "200", "500", "1000"];

  const updateDuration = (kind, currentDuration, nextDuration, setDuration) => {
    if (currentDuration === nextDuration) return;
    const current = values.selectedPackage || "";

    setDuration(nextDuration);
    const pattern =
      kind === "family" ? /^family-(18|24)-(.+)$/ : /^vip-(12|18)-(.+)$/;
    const match = current.match(pattern);
    if (match) {
      setFieldValue("selectedPackage", `${kind}-${nextDuration}-${match[2]}`);
    }
  };

  const techOptions = [
    {
      value: "vdsl",
      title: "VDSL",
      speed: "100",
      price: 699,
      color: "blue",
      features: ["التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوتر تقسيط مع الفاتورة"],
    },
    {
      value: "fiber",
      title: "Fiber",
      speed: "100",
      price: 699,
      color: "green",
      features: ["التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوترات الفايبر مجاناً"],
    },
    {
      value: "gigafiber",
      title: "GigaFiber",
      speed: "1000",
      price: 699,
      color: "purple",
      features: ["التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوترات الفايبر مجاناً"],
    },
  ];

  if (isWithContract) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
        <div className="md:px-6">
          <PackageSection
            accent="blue"
            title="الباقات العائلية المخفضة"
            description="باقات الإنترنت العائلي والإقتصادي (البنية التحتية لجوك تيليكوم)"
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
          <div className="flex justify-center w-full mt-4">
            <iframe
              className="w-full max-w-[560px] aspect-video rounded-xl shadow-md"
              src="https://www.youtube.com/embed/lyav1Uz9DVI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <PackageSection
            accent="purple"
            title="باقات الإنترنت VIP"
            description="باقات الإنترنت الأقوى والأسرع (البنية التحتية لترك تيليكوم)"
            durationLabel={vipContractDuration === "12" ? "سنة" : "18 شهر"}
            durations={[
              { value: "12", label: "سنة" },
              { value: "18", label: "18 شهر" },
            ]}
            selectedDuration={vipContractDuration}
            onDurationChange={(nextDuration) =>
              updateDuration(
                "vip",
                vipContractDuration,
                nextDuration,
                setVipContractDuration,
              )
            }
            speeds={vipSpeeds}
            packageKind="vip"
            selectedPackage={values.selectedPackage}
          />
          <div className="flex justify-center w-full mt-4">
            <iframe
              className="w-full max-w-[560px] aspect-video rounded-xl shadow-md"
              src="https://www.youtube.com/embed/lyav1Uz9DVI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
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
  }

  /* ── Without contract: tech type selection ── */
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="اختر نوع الخدمة"
        subTitle="يمكنك اختيار نوع البنية التحتية المتوفرة لديك"
      />

      <div className="md:px-4">
        <TechTypeGrid
          options={techOptions}
          selectedTechType={values.noContractTechType}
        />
      </div>

      <p className="text-center text-sm text-gray-400 font-medium">
        يمكنك تخطي هذه الخطوة والمتابعة مباشرة
      </p>
    </div>
  );
};

export default Step5;
