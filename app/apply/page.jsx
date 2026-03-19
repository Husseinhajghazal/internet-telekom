"use client";

import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, yupToFormErrors } from "formik";
import * as Yup from "yup";
import {
  MdWifi,
  MdWifiOff,
  MdPhoneInTalk,
  MdCancel,
  MdPerson,
  MdLocationOn,
  MdRefresh,
  MdAcUnit,
  MdUpgrade,
  MdSpeed,
} from "react-icons/md";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { RiFileCloseLine } from "react-icons/ri";
import { FaFileContract } from "react-icons/fa6";
import { GiWifiRouter } from "react-icons/gi";
import { LuPackageSearch } from "react-icons/lu";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbFileInvoiceFilled } from "react-icons/tb";
import { BiWifi, BiHelpCircle } from "react-icons/bi";

const ApplyPage = () => {
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepDirection, setStepDirection] = useState("forward"); // "forward" | "back"
  const [familyContractDuration, setFamilyContractDuration] = useState("18"); // "18" | "24"
  const [vipContractDuration, setVipContractDuration] = useState("12"); // "12" | "18"
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmValues, setConfirmValues] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const formRef = useRef();

  const describeServiceType = (serviceType = "") => {
    if (serviceType === "newline") return "خط جديد";
    if (serviceType === "services") return "خدمات";
    if (serviceType === "inquiry") return "استعلام";
    return serviceType || "—";
  };

  const describeContractPreference = (contractPreference = "") => {
    if (contractPreference === "with") return "مع عقد";
    if (contractPreference === "without") return "بدون عقد";
    return contractPreference || "—";
  };

  const describeSelectedService = (selectedService = "") => {
    const map = {
      cancel: "إلغاء الاشتراك",
      "transfer-name": "نقل ملكية (تغيير الاسم)",
      "transfer-address": "نقل خط (تغيير العنوان)",
      renew: "تجديد الاشتراك",
      freeze: "تجميد الاشتراك",
      upgrade: "تحديث الخدمة الحالية",
    };
    return map[selectedService] || selectedService || "—";
  };

  const describeSelectedPackage = (selectedPackage = "") => {
    if (!selectedPackage) return "—";
    const noContractMatch = selectedPackage.match(/^no-contract-(.+)$/);
    if (noContractMatch) {
      const speed = noContractMatch[1];
      return `بدون عقد • ${speed} ميغابت/ثانية`;
    }

    const match = selectedPackage.match(/^(family|vip)-(\d+)-(.+)$/);
    if (!match) return selectedPackage;
    const [, kind, duration, speed] = match;
    const kindLabel = kind === "family" ? "عائلية" : "VIP";
    const durationLabel =
      duration === "12"
        ? "سنة"
        : duration === "18"
          ? "18 شهر"
          : duration === "24"
            ? "سنتين"
            : `${duration} شهر`;
    return `${kindLabel} • ${speed} ميغابت/ثانية • ${durationLabel}`;
  };

  const getValidationSchema = (values) =>
    Yup.object({
      name:
        step === 1
          ? Yup.string()
              .trim()
              .required("الاسم مطلوب")
              .min(2, "الاسم يجب أن يكون على الأقل حرفين")
          : Yup.string(),

      phone:
        step === 1
          ? Yup.string()
              .required("رقم الهاتف مطلوب")
              .test("phone-format", "رقم الهاتف غير صحيح", (value = "") => {
                const digits = value.replace(/\D/g, "");
                return digits.length === 12 && digits.startsWith("90");
              })
          : Yup.string(),

      hasInternet:
        step === 2 ? Yup.string().required("يرجى اختيار إجابة") : Yup.string(),

      serviceType:
        step === 3
          ? Yup.string().required("يرجى اختيار نوع الخدمة")
          : Yup.string(),

      contractPreference:
        step === 4 && values?.serviceType === "newline"
          ? Yup.string().required("يرجى اختيار نوع العروض")
          : Yup.string(),

      selectedService:
        step === 4 && values?.serviceType === "services"
          ? Yup.string().required("يرجى اختيار الخدمة المناسبة")
          : Yup.string(),

      selectedPackage:
        step === 5 && values?.serviceType === "newline"
          ? Yup.string().required("يرجى اختيار الباقة المناسبة")
          : Yup.string(),

      address:
        step === 6 ? Yup.string().required("العنوان مطلوب") : Yup.string(),
    });

  const getStepFieldOrder = (values) => {
    if (step === 1) return ["name", "phone"];
    if (step === 2) return ["hasInternet"];
    if (step === 3) return ["serviceType"];
    if (step === 4) {
      if (values?.serviceType === "services") return ["selectedService"];
      if (values?.serviceType === "newline") return ["contractPreference"];
      return ["contractPreference", "selectedService"];
    }
    if (step === 5) return ["selectedPackage"];
    if (step === 6) return ["address"];
    return [];
  };

  const validate = async (values) => {
    try {
      await getValidationSchema(values).validate(values, { abortEarly: false });
      return {};
    } catch (err) {
      return yupToFormErrors(err);
    }
  };

  const formatPhoneNumber = (value) => {
    let formatted = value.replace(/\D/g, "");
    if (formatted.startsWith("90")) {
      formatted = formatted.substring(2);
    }
    if (formatted.length > 10) {
      formatted = formatted.substring(0, 10);
    }
    let display = "+90 ";
    if (formatted.length > 0) {
      display += "(" + formatted.substring(0, 3);
    }
    if (formatted.length > 3) {
      display += ") " + formatted.substring(3, 6);
    }
    if (formatted.length > 6) {
      display += " " + formatted.substring(6, 8);
    }
    if (formatted.length > 8) {
      display += " " + formatted.substring(8, 10);
    }
    return display;
  };

  const handlePhoneChange = (e, setFieldValue) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFieldValue("phone", formatted);
  };

  const handleSubmit = (values) => {
    if (step !== 6) setStepDirection("forward");
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (values.serviceType === "services") {
        setStep(4);
      } else if (values.serviceType === "newline") {
        setStep(4);
      } else if (values.serviceType === "inquiry") {
        setStep(6);
      }
    } else if (step === 4) {
      if (values.serviceType === "services") {
        setStep(6);
      } else if (values.serviceType === "newline") {
        setStep(5);
      }
    } else if (step === 5) {
      setStep(6);
    } else if (step === 6) {
      setConfirmValues(values);
      setIsConfirmOpen(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = (values) => {
    if (step === 1) {
      return;
    } else if (step === 2) {
      setStepDirection("back");
      setStep(1);
    } else if (step === 3) {
      setStepDirection("back");
      setStep(2);
    } else if (step === 4) {
      // Step 4 always goes back to step 3
      setStepDirection("back");
      setStep(3);
    } else if (step === 5) {
      // Step 5 goes back to step 4 (for newline with contract preference)
      setStepDirection("back");
      setStep(4);
    } else if (step === 6) {
      // Step 6 goes back to step 5 if newline, or step 4 if services, or step 3 if inquiry
      if (values.serviceType === "services") {
        setStepDirection("back");
        setStep(4);
      } else if (values.serviceType === "newline") {
        setStepDirection("back");
        setStep(5);
      } else if (values.serviceType === "inquiry") {
        setStepDirection("back");
        setStep(3);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 overflow-x-hidden">
      {isCompleted ? (
        <div className="flex flex-col items-center justify-center min-h-svh p-6">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Success Icon */}
            <div className="relative">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-green-400 to-green-600 rounded-full shadow-2xl">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-green-300/30 to-green-500/30 rounded-full animate-ping"></div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                تم إرسال طلبك بنجاح!
              </h1>
              <p className="text-xl text-gray-600">
                شكراً لك على تقديم طلبك عن طريق إنترنت تيليكوم
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="text-right space-y-4">
                <div className="flex items-center justify-start gap-3">
                  <span className="text-gray-700 font-medium">رقم الطلب:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-start gap-3">
                  <span className="text-gray-700">وقت الإرسال:</span>
                  <span className="text-gray-600">
                    {new Date().toLocaleString("ar-SA")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">
                  ما سيحدث الآن:
                </h3>
                <div className="space-y-3 text-right">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <span className="text-gray-700">
                      سيتم مراجعة طلبك من قبل فريقنا
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <span className="text-gray-700">
                      سنتواصل معك خلال 24 ساعة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="text-center space-y-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  هل تحتاج مساعدة؟
                </h4>
                <p className="text-gray-600">
                  تواصل معنا على الرقم:{" "}
                  <a
                    href="tel:00905387345820"
                    className="font-bold text-blue-600 block md:inline"
                  >
                    +90 (538) 734-5820
                  </a>
                </p>
                <p className="text-gray-600">
                  أو عبر البريد الإلكتروني:{" "}
                  <a
                    href="mailto:support@telekom.com"
                    className="font-bold text-blue-600"
                  >
                    support@telekom.com
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white rounded-lg font-bold hover:from-[#0d8bc9] hover:to-[#18a2e3] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                طلب جديد
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{
            name: "",
            phone: "+90 ",
            hasInternet: "",
            serviceType: "",
            contractPreference: "",
            selectedService: "",
            selectedPackage: "",
            address: "",
            note: "",
            invoiceFile: null,
          }}
          validate={validate}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {({ setFieldValue, errors, touched, values }) => (
            <Form className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
              {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
                  <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setIsConfirmOpen(false)}
                  />
                  <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-right space-y-2">
                          <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
                            تأكيد الطلب
                          </h3>
                          <p className="text-gray-600">
                            تأكد من صحة المعلومات قبل الإرسال
                          </p>
                        </div>
                        <button
                          type="button"
                          className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 text-gray-600"
                          onClick={() => setIsConfirmOpen(false)}
                          aria-label="Close"
                        >
                          <MdCancel size={24} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2">
                          <div className="text-sm text-gray-500 font-bold">
                            الاسم
                          </div>
                          <div className="text-gray-800 font-semibold">
                            {confirmValues?.name || "—"}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2">
                          <div className="text-sm text-gray-500 font-bold">
                            رقم الهاتف
                          </div>
                          <div
                            style={{ direction: "ltr" }}
                            className="text-gray-800 font-semibold"
                          >
                            {confirmValues?.phone || "—"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                          <div className="text-sm text-gray-500 font-bold">
                            نوع الطلب
                          </div>
                          <div className="text-gray-800 font-semibold">
                            {describeServiceType(confirmValues?.serviceType)}
                          </div>
                        </div>

                        {confirmValues?.serviceType === "newline" && (
                          <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                            <div className="text-sm text-gray-500 font-bold">
                              نوع العروض
                            </div>
                            <div className="text-gray-800 font-semibold">
                              {describeContractPreference(
                                confirmValues?.contractPreference,
                              )}
                            </div>
                          </div>
                        )}

                        {confirmValues?.serviceType === "services" && (
                          <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                            <div className="text-sm text-gray-500 font-bold">
                              الخدمة المختارة
                            </div>
                            <div className="text-gray-800 font-semibold">
                              {describeSelectedService(
                                confirmValues?.selectedService,
                              )}
                            </div>
                          </div>
                        )}

                        {confirmValues?.serviceType === "newline" && (
                          <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                            <div className="text-sm text-gray-500 font-bold">
                              الباقة المختارة
                            </div>
                            <div className="text-gray-800 font-semibold">
                              {describeSelectedPackage(
                                confirmValues?.selectedPackage,
                              )}
                            </div>
                          </div>
                        )}

                        <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                          <div className="text-sm text-gray-500 font-bold">
                            العنوان
                          </div>
                          <div className="text-gray-800 font-semibold whitespace-pre-wrap">
                            {confirmValues?.address || "—"}
                          </div>
                        </div>

                        {(confirmValues?.note || "").trim() && (
                          <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                            <div className="text-sm text-gray-500 font-bold">
                              ملاحظة
                            </div>
                            <div className="text-gray-800 font-semibold whitespace-pre-wrap">
                              {confirmValues?.note}
                            </div>
                          </div>
                        )}

                        <div className="rounded-2xl border border-gray-200 p-4 text-right space-y-2 md:col-span-2">
                          <div className="text-sm text-gray-500 font-bold">
                            صورة الفاتورة
                          </div>
                          <div className="text-gray-800 font-semibold">
                            {confirmValues?.invoiceFile?.name || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <button
                          type="button"
                          onClick={() => setIsConfirmOpen(false)}
                          className="cursor-pointer flex-1 py-3 px-6 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsConfirmOpen(false);
                            setIsCompleted(true);
                          }}
                          className="cursor-pointer flex-1 py-3 px-6 rounded-xl font-bold bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          تأكيد الطلب
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="p-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  تقديم طلب لإنترنت تيليكوم
                </h1>
                <p className="text-gray-600 mt-2">الخطوة {step} من 6</p>
              </div>

              {/* Progress Bar */}
              <div className="px-6 mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#18a2e3] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 6) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 px-6">
                <div
                  key={step}
                  className={
                    stepDirection === "back"
                      ? "animate-step-in-left"
                      : "animate-step-in-right"
                  }
                >
                  {step === 1 && (
                    <div className="max-w-md mx-auto space-y-6">
                      <div>
                        <label className="block text-right text-gray-700 font-medium mb-2">
                          الاسم الكامل
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                            errors.name && touched.name
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="أدخل اسمك الكامل"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1 text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-right text-gray-700 font-medium mb-2">
                          رقم الهاتف
                        </label>
                        <Field
                          type="tel"
                          name="phone"
                          className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="+90 (XXX) XXX XX XX"
                          onChange={(e) => handlePhoneChange(e, setFieldValue)}
                          style={{ direction: "ltr" }}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1 text-right"
                        />
                        <p className="text-sm text-gray-500 mt-1 text-right">
                          أدخل رقم هاتفك التركي
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {/* Question Header */}
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-4">
                          <BiWifi
                            className="inline-block text-[#18a2e3]"
                            size={60}
                          />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                          هل لديك خط إنترنت؟
                        </h2>
                        <p className="text-gray-600 md:text-lg">
                          هذا سيساعدنا على تقديم أفضل خدمة لك
                        </p>
                      </div>

                      {/* Cards Container */}
                      <div className="flex gap-3 md:gap-6 justify-center md:px-6">
                        {/* No Card */}
                        <label className="flex-1 max-w-xs cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.hasInternet === "no"
                                ? "border-red-500 bg-red-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-red-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.hasInternet === "no"
                                  ? "bg-red-500 border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.hasInternet === "no" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-red-500">
                              <MdWifiOff size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-2xl font-bold text-gray-800">
                              لا
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              لا أملك خط انترنت حالياً
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="hasInternet"
                            value="no"
                            className="hidden"
                          />
                        </label>

                        {/* Yes Card */}
                        <label className="flex-1 max-w-xs cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.hasInternet === "yes"
                                ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.hasInternet === "yes"
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.hasInternet === "yes" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-green-500">
                              <MdWifi size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-2xl font-bold text-gray-800">
                              نعم
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              أملك خط انترنت بالفعل
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="hasInternet"
                            value="yes"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Error Message */}
                      {errors.hasInternet && touched.hasInternet && (
                        <ErrorMessage
                          name="hasInternet"
                          component="div"
                          className="text-red-500 text-center font-medium"
                        />
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {/* Question Header */}
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-4">
                          <BiHelpCircle
                            className="inline-block text-[#18a2e3]"
                            size={60}
                          />
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                          هل تبحث عن خدمة معينة أو خط جديد؟
                        </h2>
                        <p className="text-gray-600 md:text-lg">
                          اختر الخيار الذي يناسبك
                        </p>
                      </div>

                      {/* Cards Container */}
                      <div
                        className={`grid gap-3 md:gap-6 justify-center md:px-6 grid-cols-2 ${values.hasInternet === "no" && "md:grid-cols-3"}`}
                      >
                        {/* New Line Card (Only if hasInternet === 'no') */}
                        {values.hasInternet === "no" && (
                          <label className="col-span-2 md:col-span-1 cursor-pointer group">
                            <div
                              className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                                values.serviceType === "newline"
                                  ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                  : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                              }`}
                            >
                              {/* Checkbox indicator */}
                              <div
                                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                  values.serviceType === "newline"
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {values.serviceType === "newline" && (
                                  <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                    ✓
                                  </div>
                                )}
                              </div>

                              {/* Icon */}
                              <div className="text-5xl text-green-500">
                                <GiWifiRouter size={60} />
                              </div>

                              {/* Text */}
                              <span className="text-2xl font-bold text-gray-800">
                                خط جديد
                              </span>
                              <p className="text-sm text-gray-600 text-center">
                                طلب خط انترنت جديد
                              </p>
                            </div>
                            <Field
                              type="radio"
                              name="serviceType"
                              value="newline"
                              className="hidden"
                            />
                          </label>
                        )}

                        {/* Services Card */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.serviceType === "services"
                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.serviceType === "services"
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.serviceType === "services" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-blue-500">
                              <LuPackageSearch size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-2xl font-bold text-gray-800">
                              خدمات
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              معرفة الخدمات المتاحة لديك
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="serviceType"
                            value="services"
                            className="hidden"
                          />
                        </label>

                        {/* Inquiry Card */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.serviceType === "inquiry"
                                ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.serviceType === "inquiry"
                                  ? "bg-purple-500 border-purple-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.serviceType === "inquiry" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-purple-500">
                              <RiCustomerService2Line size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-2xl font-bold text-gray-800">
                              استعلام
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              الاستعلام عن الاشتراك الحالي
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="serviceType"
                            value="inquiry"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Error Message */}
                      {errors.serviceType && touched.serviceType && (
                        <ErrorMessage
                          name="serviceType"
                          component="div"
                          className="text-red-500 text-center font-medium"
                        />
                      )}
                    </div>
                  )}

                  {step === 4 && values.serviceType === "services" && (
                    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {/* Question Header */}
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-4">
                          <MdWifi
                            className="inline-block text-blue-500"
                            size={60}
                          />
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                          اختر الخدمة المناسبة لك
                        </h2>
                        <p className="text-gray-600 md:text-lg">
                          اختر من القائمة التالية
                        </p>
                      </div>

                      {/* Services Grid */}
                      <div className="grid md:grid-cols-2 gap-3 md:gap-6 md:px-6">
                        {/* Cancel Internet Line */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "cancel"
                                ? "border-red-500 bg-red-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-red-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "cancel"
                                  ? "bg-red-500 border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService === "cancel" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-red-500">
                              <MdCancel size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              إبطال خط الإنترنت
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="cancel"
                            className="hidden"
                          />
                        </label>

                        {/* Transfer to Another Name */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "transfer-name"
                                ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "transfer-name"
                                  ? "bg-purple-500 border-purple-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService === "transfer-name" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-purple-500">
                              <MdPerson size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              نقل ملكية خط الإنترنت
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="transfer-name"
                            className="hidden"
                          />
                        </label>

                        {/* Transfer to Another Address */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "transfer-address"
                                ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "transfer-address"
                                  ? "bg-orange-500 border-orange-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService ===
                                "transfer-address" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-orange-500">
                              <MdLocationOn size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              نقل خط الإنترنت لعنوان آخر
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="transfer-address"
                            className="hidden"
                          />
                        </label>

                        {/* Renew Contract */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "renew"
                                ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "renew"
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService === "renew" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-green-500">
                              <MdRefresh size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              تجديد عقد خط الإنترنت
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="renew"
                            className="hidden"
                          />
                        </label>

                        {/* Freeze Line */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "freeze"
                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "freeze"
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService === "freeze" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-blue-500">
                              <MdAcUnit size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              تجميد خط الإنترنت
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="freeze"
                            className="hidden"
                          />
                        </label>

                        {/* Update Old Service */}
                        <label className="cursor-pointer group">
                          <div
                            className={`relative h-40 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 ${
                              values.selectedService === "upgrade"
                                ? "border-indigo-500 bg-indigo-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.selectedService === "upgrade"
                                  ? "bg-indigo-500 border-indigo-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.selectedService === "upgrade" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-indigo-500">
                              <MdUpgrade size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-lg font-bold text-gray-800 text-center">
                              تحديث الخدمة الحالية
                            </span>
                          </div>
                          <Field
                            type="radio"
                            name="selectedService"
                            value="upgrade"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Error Message */}
                      {errors.selectedService && touched.selectedService && (
                        <ErrorMessage
                          name="selectedService"
                          component="div"
                          className="text-red-500 text-center font-medium"
                        />
                      )}
                    </div>
                  )}

                  {step === 4 && values.serviceType === "newline" && (
                    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {/* Question Header */}
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-4">
                          <FaFileCircleQuestion
                            className="inline-block text-purple-500"
                            size={60}
                          />
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                          اختر نوع العروض
                        </h2>
                        <p className="text-gray-600 md:text-lg">
                          هل تفضل عروض مع عقد أم بدون عقد؟
                        </p>
                      </div>

                      {/* Contract Options */}
                      <div className="flex gap-3 md:gap-6 justify-center md:px-6">
                        {/* With Contract */}
                        <label className="flex-1 max-w-xs cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.contractPreference === "with"
                                ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                            }`}
                          >
                            {/* Selection Circle */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.contractPreference === "with"
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.contractPreference === "with" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-green-500">
                              <FaFileContract size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-xl font-bold text-gray-800">
                              مع عقد
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              عروض حصرية مع عقد اشتراك
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="contractPreference"
                            value="with"
                            className="hidden"
                          />
                        </label>

                        {/* Without Contract */}
                        <label className="flex-1 max-w-xs cursor-pointer group">
                          <div
                            className={`relative h-60 md:h-64 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 ${
                              values.contractPreference === "without"
                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            {/* Selection Circle */}
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${
                                values.contractPreference === "without"
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {values.contractPreference === "without" && (
                                <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div className="text-5xl text-blue-500">
                              <RiFileCloseLine size={60} />
                            </div>

                            {/* Text */}
                            <span className="text-xl font-bold text-gray-800">
                              بدون عقد
                            </span>
                            <p className="text-sm text-gray-600 text-center">
                              سرعات متنوعة بدون التزام عقد
                            </p>
                          </div>
                          <Field
                            type="radio"
                            name="contractPreference"
                            value="without"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Error Message */}
                      {errors.contractPreference &&
                        touched.contractPreference && (
                          <ErrorMessage
                            name="contractPreference"
                            component="div"
                            className="text-red-500 text-center font-medium"
                          />
                        )}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="max-w-6xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {values.contractPreference === "without" && (
                        <>
                          <div className="text-center space-y-3">
                            <div className="text-6xl mb-4">
                              <MdSpeed
                                className="inline-block text-purple-500"
                                size={60}
                              />
                            </div>
                            <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                              اختر السرعة المناسبة لك
                            </h2>
                            <p className="text-gray-600 md:text-lg">
                              اختر من السرعات المتاحة بدون عقد
                            </p>
                          </div>

                          <div className="md:px-6">
                            <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-4 snap-x snap-mandatory pb-2">
                              {[
                                "16",
                                "24",
                                "50",
                                "100",
                                "200",
                                "500",
                                "1000",
                              ].map((speed) => (
                                <label
                                  key={`no-contract-${speed}`}
                                  className="cursor-pointer group transform transition-all duration-300 hover:scale-105 shrink-0 w-64 md:w-auto snap-center"
                                >
                                  <div
                                    className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 shadow-xl hover:shadow-2xl ${
                                      values.selectedPackage ===
                                      `no-contract-${speed}`
                                        ? "border-purple-500 bg-linear-to-br from-purple-50 to-purple-100 shadow-purple-200"
                                        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-purple-100"
                                    }`}
                                  >
                                    <div className="absolute inset-0 opacity-5">
                                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full -translate-y-16 translate-x-16"></div>
                                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full translate-y-12 -translate-x-12"></div>
                                    </div>

                                    <div
                                      className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                        values.selectedPackage ===
                                        `no-contract-${speed}`
                                          ? "bg-purple-500 border-purple-500 shadow-lg"
                                          : "border-gray-300 group-hover:border-purple-400"
                                      }`}
                                    >
                                      {values.selectedPackage ===
                                        `no-contract-${speed}` && (
                                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                                          ✓
                                        </div>
                                      )}
                                    </div>

                                    <div className="relative p-6 text-center space-y-4">
                                      <div
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                                          values.selectedPackage ===
                                          `no-contract-${speed}`
                                            ? "bg-purple-500 shadow-lg"
                                            : "bg-purple-100 group-hover:bg-purple-200"
                                        } transition-all duration-300`}
                                      >
                                        <MdSpeed
                                          className={`text-2xl ${
                                            values.selectedPackage ===
                                            `no-contract-${speed}`
                                              ? "text-white"
                                              : "text-purple-600"
                                          }`}
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <div className="text-3xl font-bold text-gray-800">
                                          {speed}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">
                                          ميغابت/ثانية
                                        </div>
                                      </div>
                                    </div>

                                    <div className="absolute inset-0 bg-linear-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                                  </div>
                                  <Field
                                    type="radio"
                                    name="selectedPackage"
                                    value={`no-contract-${speed}`}
                                    className="hidden"
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {values.contractPreference === "with" && (
                        <>
                          <div className="text-center space-y-3">
                            <div className="text-6xl mb-4">
                              <MdSpeed
                                className="inline-block text-blue-500"
                                size={60}
                              />
                            </div>
                            <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                              اختر الباقة المناسبة لك
                            </h2>
                            <p className="text-gray-600 md:text-lg">
                              اختر من الباقات المتاحة
                            </p>
                          </div>

                          {/* Packages Sections */}
                          <div className="space-y-16 md:px-6">
                            {/* Family Reduced Packages */}
                            <div className="space-y-8">
                              <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full shadow-lg">
                                  <MdWifi className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                  الباقات العائلية المخفضة
                                </h3>
                                <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
                                  باقات مصممة خصيصاً للعائلات مع أسعار مخفضة
                                  وخدمات شاملة
                                </p>
                              </div>

                              <div className="space-y-6">
                                <div className="text-center">
                                  <h4 className="text-lg md:text-2xl font-semibold text-gray-700 inline-flex items-center gap-2">
                                    <MdRefresh className="text-blue-500" />
                                    عقد اشتراك مدة{" "}
                                    {familyContractDuration === "18"
                                      ? "18 شهر"
                                      : "سنتين"}
                                  </h4>
                                  <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-blue-600 mx-auto mt-2 rounded-full"></div>
                                </div>

                                <div className="flex justify-center">
                                  <div className="inline-flex rounded-2xl border border-blue-200 bg-white shadow-sm p-1.5 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (familyContractDuration === "18")
                                          return;
                                        const current =
                                          values.selectedPackage || "";
                                        const nextDuration = "18";
                                        setFamilyContractDuration(nextDuration);
                                        const match = current.match(
                                          /^family-(18|24)-(.+)$/,
                                        );
                                        if (match) {
                                          setFieldValue(
                                            "selectedPackage",
                                            `family-${nextDuration}-${match[2]}`,
                                          );
                                        }
                                      }}
                                      className={`cursor-pointer px-6 py-3 rounded-xl text-base md:text-lg font-bold transition-all duration-200 ${
                                        familyContractDuration === "18"
                                          ? "bg-blue-500 text-white shadow"
                                          : "text-blue-700 hover:bg-blue-50"
                                      }`}
                                    >
                                      18 شهر
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (familyContractDuration === "24")
                                          return;
                                        const current =
                                          values.selectedPackage || "";
                                        const nextDuration = "24";
                                        setFamilyContractDuration(nextDuration);
                                        const match = current.match(
                                          /^family-(18|24)-(.+)$/,
                                        );
                                        if (match) {
                                          setFieldValue(
                                            "selectedPackage",
                                            `family-${nextDuration}-${match[2]}`,
                                          );
                                        }
                                      }}
                                      className={`cursor-pointer px-6 py-3 rounded-xl text-base md:text-lg font-bold transition-all duration-200 ${
                                        familyContractDuration === "24"
                                          ? "bg-blue-500 text-white shadow"
                                          : "text-blue-700 hover:bg-blue-50"
                                      }`}
                                    >
                                      سنتين
                                    </button>
                                  </div>
                                </div>

                                <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-6 snap-x snap-mandatory pb-2">
                                  {["16", "24", "50", "100"].map((speed) => (
                                    <label
                                      key={`family-${familyContractDuration}-${speed}`}
                                      className="cursor-pointer group transform transition-all duration-300 hover:scale-105 shrink-0 w-64 md:w-auto snap-center"
                                    >
                                      <div
                                        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 shadow-xl hover:shadow-2xl ${
                                          values.selectedPackage ===
                                          `family-${familyContractDuration}-${speed}`
                                            ? "border-blue-500 bg-linear-to-br from-blue-50 to-blue-100 shadow-blue-200"
                                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-blue-100"
                                        }`}
                                      >
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16"></div>
                                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12"></div>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div
                                          className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                            values.selectedPackage ===
                                            `family-${familyContractDuration}-${speed}`
                                              ? "bg-blue-500 border-blue-500 shadow-lg"
                                              : "border-gray-300 group-hover:border-blue-400"
                                          }`}
                                        >
                                          {values.selectedPackage ===
                                            `family-${familyContractDuration}-${speed}` && (
                                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                                              ✓
                                            </div>
                                          )}
                                        </div>

                                        {/* Content */}
                                        <div className="relative p-6 text-center space-y-4">
                                          {/* Speed Icon */}
                                          <div
                                            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                                              values.selectedPackage ===
                                              `family-${familyContractDuration}-${speed}`
                                                ? "bg-blue-500 shadow-lg"
                                                : "bg-blue-100 group-hover:bg-blue-200"
                                            } transition-all duration-300`}
                                          >
                                            <MdSpeed
                                              className={`text-2xl ${
                                                values.selectedPackage ===
                                                `family-${familyContractDuration}-${speed}`
                                                  ? "text-white"
                                                  : "text-blue-600"
                                              }`}
                                            />
                                          </div>

                                          {/* Speed Text */}
                                          <div className="space-y-1">
                                            <div className="text-3xl font-bold text-gray-800">
                                              {speed}
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">
                                              ميغابت/ثانية
                                            </div>
                                          </div>
                                        </div>

                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                                      </div>
                                      <Field
                                        type="radio"
                                        name="selectedPackage"
                                        value={`family-${familyContractDuration}-${speed}`}
                                        className="hidden"
                                      />
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* VIP Internet Packages */}
                            <div className="space-y-8">
                              <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-400 to-purple-600 rounded-full shadow-lg">
                                  <MdWifi className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl md:text-3xl font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                  باقات الإنترنت VIP
                                </h3>
                                <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
                                  باقات متميزة للمستخدمين المتقدمين مع سرعات
                                  عالية وجودة فائقة
                                </p>
                              </div>

                              <div className="space-y-6">
                                <div className="text-center">
                                  <h4 className="text-lg md:text-2xl font-semibold text-gray-700 inline-flex items-center gap-2">
                                    <MdRefresh className="text-purple-500" />
                                    عقد اشتراك مدة{" "}
                                    {vipContractDuration === "12"
                                      ? "سنة"
                                      : "18 شهر"}
                                  </h4>
                                  <div className="w-24 h-1 bg-linear-to-r from-purple-400 to-purple-600 mx-auto mt-2 rounded-full"></div>
                                </div>
                                <div className="flex justify-center">
                                  <div className="inline-flex rounded-2xl border border-purple-200 bg-white shadow-sm p-1.5 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (vipContractDuration === "12")
                                          return;
                                        const current =
                                          values.selectedPackage || "";
                                        const nextDuration = "12";
                                        setVipContractDuration(nextDuration);
                                        const match =
                                          current.match(/^vip-(12|18)-(.+)$/);
                                        if (match) {
                                          setFieldValue(
                                            "selectedPackage",
                                            `vip-${nextDuration}-${match[2]}`,
                                          );
                                        }
                                      }}
                                      className={`cursor-pointer px-6 py-3 rounded-xl text-base md:text-lg font-bold transition-all duration-200 ${
                                        vipContractDuration === "12"
                                          ? "bg-purple-500 text-white shadow"
                                          : "text-purple-700 hover:bg-purple-50"
                                      }`}
                                    >
                                      سنة
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (vipContractDuration === "18")
                                          return;
                                        const current =
                                          values.selectedPackage || "";
                                        const nextDuration = "18";
                                        setVipContractDuration(nextDuration);
                                        const match =
                                          current.match(/^vip-(12|18)-(.+)$/);
                                        if (match) {
                                          setFieldValue(
                                            "selectedPackage",
                                            `vip-${nextDuration}-${match[2]}`,
                                          );
                                        }
                                      }}
                                      className={`cursor-pointer px-6 py-3 rounded-xl text-base md:text-lg font-bold transition-all duration-200 ${
                                        vipContractDuration === "18"
                                          ? "bg-purple-500 text-white shadow"
                                          : "text-purple-700 hover:bg-purple-50"
                                      }`}
                                    >
                                      18 شهر
                                    </button>
                                  </div>
                                </div>
                                <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-4 snap-x snap-mandatory pb-2">
                                  {[
                                    "16",
                                    "24",
                                    "50",
                                    "100",
                                    "200",
                                    "500",
                                    "1000",
                                  ].map((speed) => (
                                    <label
                                      key={`vip-${vipContractDuration}-${speed}`}
                                      className="cursor-pointer group transform transition-all duration-300 hover:scale-105 shrink-0 w-64 md:w-auto snap-center"
                                    >
                                      <div
                                        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 shadow-xl hover:shadow-2xl ${
                                          values.selectedPackage ===
                                          `vip-${vipContractDuration}-${speed}`
                                            ? "border-purple-500 bg-linear-to-br from-purple-50 to-purple-100 shadow-purple-200"
                                            : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-purple-100"
                                        }`}
                                      >
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full -translate-y-16 translate-x-16"></div>
                                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full translate-y-12 -translate-x-12"></div>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div
                                          className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                            values.selectedPackage ===
                                            `vip-${vipContractDuration}-${speed}`
                                              ? "bg-purple-500 border-purple-500 shadow-lg"
                                              : "border-gray-300 group-hover:border-purple-400"
                                          }`}
                                        >
                                          {values.selectedPackage ===
                                            `vip-${vipContractDuration}-${speed}` && (
                                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                                              ✓
                                            </div>
                                          )}
                                        </div>

                                        {/* Content */}
                                        <div className="relative p-6 text-center space-y-4">
                                          {/* Speed Icon */}
                                          <div
                                            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                                              values.selectedPackage ===
                                              `vip-${vipContractDuration}-${speed}`
                                                ? "bg-purple-500 shadow-lg"
                                                : "bg-purple-100 group-hover:bg-purple-200"
                                            } transition-all duration-300`}
                                          >
                                            <MdSpeed
                                              className={`text-2xl ${
                                                values.selectedPackage ===
                                                `vip-${vipContractDuration}-${speed}`
                                                  ? "text-white"
                                                  : "text-purple-600"
                                              }`}
                                            />
                                          </div>

                                          {/* Speed Text */}
                                          <div className="space-y-1">
                                            <div className="text-3xl font-bold text-gray-800">
                                              {speed}
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">
                                              ميغابت/ثانية
                                            </div>
                                          </div>
                                        </div>

                                        {/* Hover Effect */}
                                        <div className="absolute inset-0 bg-linear-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                                      </div>
                                      <Field
                                        type="radio"
                                        name="selectedPackage"
                                        value={`vip-${vipContractDuration}-${speed}`}
                                        className="hidden"
                                      />
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Error Message */}
                      {errors.selectedPackage && touched.selectedPackage && (
                        <ErrorMessage
                          name="selectedPackage"
                          component="div"
                          className="text-red-500 text-center font-medium"
                        />
                      )}
                    </div>
                  )}

                  {step === 6 && (
                    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8 md:py-8">
                      {/* Question Header */}
                      <div className="text-center space-y-3">
                        <div className="text-6xl mb-4">
                          <MdPhoneInTalk
                            className="inline-block text-[#18a2e3]"
                            size={60}
                          />
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
                          أكمل إدخال معلوماتك
                        </h2>
                        <p className="text-gray-600 md:text-lg">
                          يرجى إكمال البيانات المطلوبة لمعالجة طلبك
                        </p>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4 md:space-y-8 md:px-6">
                        {/* Address Field */}
                        <div>
                          <label className="block text-right text-gray-700 font-medium md:text-lg mb-4">
                            العنوان
                          </label>
                          <Field
                            as="textarea"
                            name="address"
                            rows={4}
                            className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none ${
                              errors.address && touched.address
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="أدخل عنوانك الكامل (المدينة، الحي، الشارع، رقم المبنى، إلخ)"
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="text-red-500 text-sm text-right"
                          />
                        </div>

                        {/* Note Field */}
                        <div className="space-y-4">
                          <label className="block text-right text-gray-700 font-medium md:text-lg">
                            ملاحظة إضافية (اختياري)
                          </label>
                          <Field
                            as="textarea"
                            name="note"
                            rows={3}
                            className="w-full outline-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none"
                            placeholder="أي ملاحظات إضافية تريد إضافتها..."
                          />
                        </div>

                        {/* Invoice Upload */}
                        <div className="space-y-4">
                          <label className="block text-right text-gray-700 font-medium md:text-lg">
                            صورة فاتورة (كهرباء، ماء، غاز، أو إنترنت)
                          </label>
                          <div
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                              values.invoiceFile
                                ? "border-green-400 bg-green-50"
                                : "border-gray-300 hover:border-[#18a2e3] hover:bg-blue-50"
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add(
                                "border-[#18a2e3]",
                                "bg-blue-50",
                              );
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              if (!values.invoiceFile) {
                                e.currentTarget.classList.remove(
                                  "border-[#18a2e3]",
                                  "bg-blue-50",
                                );
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files[0];
                              if (file && file.type.startsWith("image/")) {
                                setFieldValue("invoiceFile", file);
                              }
                              e.currentTarget.classList.remove(
                                "border-[#18a2e3]",
                                "bg-blue-50",
                              );
                            }}
                            onClick={() => {
                              if (!values.invoiceFile) {
                                document
                                  .getElementById("invoice-upload")
                                  .click();
                              }
                            }}
                          >
                            {values.invoiceFile ? (
                              <div className="space-y-4">
                                <div className="relative inline-block">
                                  <img
                                    src={URL.createObjectURL(
                                      values.invoiceFile,
                                    )}
                                    alt="Invoice preview"
                                    className="max-w-full max-h-32 rounded-lg shadow-md object-cover"
                                  />
                                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="text-green-700">
                                  <p className="font-semibold">
                                    تم رفع الصورة بنجاح
                                  </p>
                                  <p className="text-sm">
                                    {values.invoiceFile.name}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue("invoiceFile", null)
                                  }
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                                >
                                  إزالة الصورة
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="relative">
                                  <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                                    <TbFileInvoiceFilled className="text-3xl text-blue-600" />
                                  </div>
                                  <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full opacity-0 transition-opacity duration-300"></div>
                                </div>
                                <div className="text-gray-600">
                                  <p className="font-semibold text-lg">
                                    اسحب وأفلت الصورة هنا
                                  </p>
                                  <p className="text-sm">
                                    أو انقر لاختيار الملف
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  name="invoiceFile"
                                  accept="image/*"
                                  className="hidden"
                                  id="invoice-upload"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setFieldValue("invoiceFile", file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="invoice-upload"
                                  className="inline-block px-8 py-3 bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white rounded-lg cursor-pointer hover:from-[#0d8bc9] hover:to-[#18a2e3] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  اختر الصورة
                                </label>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 text-right">
                            يرجى رفع صورة واضحة لفاتورتك (PNG, JPG, JPEG - حد
                            أقصى 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-6">
                <div className="max-w-md mx-auto flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleBack(values)}
                    className={`cursor-pointer flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
                      step === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                    disabled={step === 1}
                  >
                    رجوع
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      formRef.current.validateForm().then((currentErrors) => {
                        const fieldOrder = getStepFieldOrder(values);
                        const orderedErrors = fieldOrder.filter(
                          (key) => currentErrors?.[key],
                        );
                        const remainingErrors = Object.keys(currentErrors || {})
                          .filter((key) => currentErrors?.[key])
                          .filter((key) => !orderedErrors.includes(key));
                        const allErrorsInOrder = [
                          ...orderedErrors,
                          ...remainingErrors,
                        ];

                        if (allErrorsInOrder.length === 0) {
                          formRef.current.submitForm();
                        } else {
                          const firstErrorKey = allErrorsInOrder[0];
                          focusFieldByName(firstErrorKey);
                        }
                      });
                    }}
                    className="flex-1 cursor-pointer bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white py-3 px-6 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {step === 6 ? "إرسال الطلب" : "متابعة"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ApplyPage;
