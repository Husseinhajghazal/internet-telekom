"use client";

import React from "react";
import { FaYoutube } from "react-icons/fa";

import { ErrorMessage } from "formik";
import PackageSection from "../PackageSection";
import TechTypeGrid from "../TechTypeGrid";
import StepHeader from "../StepHeader";
import { FaCrown } from "react-icons/fa";
import {
  MdRocketLaunch,
} from "react-icons/md";

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
      color: "purple",
      features: ["الفاتورة حقيقية وثابتة", "التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوتر تقسيط مع الفاتورة"],
    },
    {
      value: "fiber",
      title: "Fiber",
      speed: "100",
      price: 699,
      color: "purple",
      features: ["الفاتورة حقيقية وثابتة", "التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوترات الفايبر مجاناً"],
    },
    {
      value: "gigafiber",
      title: "GigaFiber",
      speed: "1000",
      price: 699,
      color: "purple",
      features: ["الفاتورة حقيقية وثابتة", "التسجيل مجاني تماماً", "التحميل غير محدود", "التركيب خلال 48 ساعة", "الراوترات الفايبر مجاناً"],
    },
  ];

  if (isWithContract) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
        <div className="md:px-6">
          <PackageSection
            accent="green"
            title="باقات الإنترنت العائلي والإقتصادي"
            description="البنية التحتية لجوك تيليكوم"
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
            detailsText="الشركة الرائدة التي استطاعت منذ تأسيسها عام 2012 أن تثبت كفاءتها كواحدة من أسرع مزودي خدمات الإنترنت نمواً في تركيا. تتميز الشركة بتقديم حلول اقتصادية وذكية تناسب ميزانيات الجميع، مع التركيز العالي على خدمات الألياف الضوئية (Fiber) والإنترنت اللاسلكي عالي السرعة. تقدم الشركة باقات مرنة ومتنوعة تلبي احتياجات الاستخدام المنزلي والتجاري، وتعتمد في نجاحها على بنية تحتية قوية تضمن استقرار الإشارة وسهولة الإجراءات الفنية. ومن خلال شراكتنا معهم، نضمن لكم الوصول إلى أفضل عروض مع ميزة الدعم الفني المتكامل باللغة العربية، لتجربة اشتراك تجمع بين التوفير والجودة في كافة الولايات التركية."
            icon={FaCrown}
          />

          <PackageSection
            accent="blue"
            title="باقات الإنترنت الأقوى والأسرع"
            description="البنية التحتية لترك تيليكوم"
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
            detailsText="الشركة الأم والمشغل الوطني الأول والأكبر في تركيا، والذي يمتلك إرثاً عريقاً يمتد لأكثر من 180 عاماً. تتميز الشركة بامتلاكها لأضخم بنية تحتية للألياف الضوئية (Fiber) تغطي كافة الولايات والقرى التركية، مما يضمن لكم استقراراً فائقاً في الاتصال وتغطية لا تضاهى. تقدم حلولاً متكاملة تشمل الإنترنت المنزلي عالي السرعة، خدمات الهاتف المحمول، والقنوات التلفزيونية الرقمية، مع الالتزام بتطوير التكنولوجيا الرقمية لتناسب احتياجات العصر. ومن خلالنا، نسهل لكم الوصول إلى هذه الخدمات العالمية بمرونة تامة ودعم فني متخصص، لنضمن بقاءكم على اتصال دائم بأعلى معايير الجودة والكفاءة."
            icon={FaCrown}
          />

          <div className="flex flex-col items-center justify-center w-full mt-6 gap-3">
            <h4 className="text-gray-700 font-bold md:text-center text-sm md:text-base px-4">
              <FaYoutube className="inline-block ml-2 text-red-500" />
              شاهد الفيديو أدناه لمزيد من التفاصيل
            </h4>
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
    <div className="max-w-5xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="اختر نوع الخدمة"
        subTitle="يمكنك اختيار نوع البنية التحتية المتوفرة لديك"
      />

      <div className="md:px-4">
        <TechTypeGrid
          options={techOptions}
          selectedTechType={values.noContractTechType}
          detailsText="نحن نضع بين أيديكم أقوى حلول الإنترنت المنزلي في تركيا بسرعات فائقة تصل إلى 1000 ميجابت عبر تقنية الألياف الضوئية (Fiber)، لتستمتعوا بتجربة فريدة للألعاب والبث المباشر بدقة 4K دون انقطاع. نمنحكم الحرية الكاملة في اختيار باقاتكم بدون عقود التزام سنوية أو غرامات فسخ عقد، مع ضمان إنترنت مفتوح بالكامل بدون حصة استخدام أو تناقص في السرعة طوال الشهر. كما نتميز بالشفافية المطلقة في الفواتير مع خيار تثبيت السعر لمدة عام، ونتكفل بكافة إجراءات انتقالكم من شركاتكم الحالية إلينا بكل سلاسة، مدعومين بفريقنا الفني الذي يخدمكم باللغة العربية على مدار الساعة لضمان تجربة تواصل رقمية لا تشوبها شائبة."
        />

        <div className="flex flex-col items-center justify-center w-full mt-6 gap-3">
          <h4 className="text-gray-700 font-bold md:text-center text-sm md:text-base px-4">
            <FaYoutube className="inline-block ml-2 text-red-500" />
            شاهد الفيديو أدناه لمزيد من التفاصيل
          </h4>
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

      <p className="text-center text-sm text-gray-400 font-medium">
        يمكنك تخطي هذه الخطوة والمتابعة مباشرة
      </p>
    </div>
  );
};

export default Step5;
