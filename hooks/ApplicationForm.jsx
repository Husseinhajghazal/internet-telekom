"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { yupToFormErrors } from "formik";
import * as Yup from "yup";
import {
  formatPhoneNumber,
  getNextStep,
  getPreviousStep,
  getStepFieldOrder,
  parsePackageDurations,
} from "../utils/general";
import { USER_AGREEMENT_TEXT } from "../utils/data";

const initialValues = {
  name: "",
  phone: "",
  userAgreementAccepted: false,
  hasInternet: "",
  serviceType: "",
  contractPreference: "",
  selectedService: "",
  selectedPackage: "",
  addressProvinceCode: "",
  addressProvinceName: "",
  addressDistrictCode: "",
  addressDistrictName: "",
  addressNeighborhoodCode: "",
  addressNeighborhoodName: "",
  addressStreetCode: "",
  addressStreetName: "",
  addressOutsideDoorNo: "",
  addressInsideDoorNo: "",
  address: "",
  note: "",
  invoiceFile: null,
  invoiceFileUrl: "",
  internetCompany: "",
  subscriptionNo: "",
  selectedInquiry: "",
  noContractTechType: ""
};

const useApplicationForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState(() => ({
    ...initialValues,
  }));
  const [step1Error, setStep1Error] = useState(null);
  const [stepDirection, setStepDirection] = useState("forward");
  const [familyContractDuration, setFamilyContractDuration] = useState("18");
  const [vipContractDuration, setVipContractDuration] = useState("12");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmValues, setConfirmValues] = useState(null);
  const [isUserAgreementOpen, setIsUserAgreementOpen] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

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
                return digits.length === 11;
              })
          : Yup.string(),

      userAgreementAccepted:
        step === 1
          ? Yup.boolean().oneOf([true], "يرجى الموافقة على اتفاقية المستخدم")
          : Yup.boolean(),

      hasInternet:
        step === 2 ? Yup.string().required("يرجى اختيار إجابة") : Yup.string(),

      serviceType:
        step === 3
          ? Yup.string().required("يرجى اختيار نوع الخدمة")
          : Yup.string(),

      contractPreference:
        step === 4 && values?.serviceType === "newline"
          ? Yup.string().required("يرجى اختيار نوع العرض")
          : Yup.string(),

      selectedService:
        step === 4 && values?.serviceType === "services"
          ? Yup.string().required("يرجى اختيار الخدمة المناسبة")
          : Yup.string(),

      selectedInquiry:
        step === 4 && values?.serviceType === "inquiry"
          ? Yup.string().required("يرجى اختيار نوع الاستشارة")
          : Yup.string(),

      selectedPackage:
        step === 5 && values?.serviceType === "newline" && values?.contractPreference === "with"
          ? Yup.string().required("يرجى اختيار الباقة المناسبة")
          : Yup.string(),
      
      internetCompany: step === 6 && values?.serviceType === "services"
        ? Yup.string().required("يرجى كتابة اسم شركة الأنترنت")
        : Yup.string(),
    });

  const validate = async (values) => {
    try {
      await getValidationSchema(values).validate(values, { abortEarly: false });
      return {};
    } catch (err) {
      return yupToFormErrors(err);
    }
  };

  const handlePhoneChange = (e, setFieldValue) => {
    setFieldValue("phone", formatPhoneNumber(e.target.value));
    setStep1Error(null);
  };
  const openUserAgreement = () => setIsUserAgreementOpen(true);
  const closeUserAgreement = () => setIsUserAgreementOpen(false);

  const mapApplicationToFormValues = (app) => ({
    ...initialValues,
    name: app.name ?? "",
    phone: app.phone ?? "",
    hasInternet: app.hasInternet ?? "",
    serviceType: app.serviceType ?? "",
    contractPreference: app.contractPreference ?? "",
    selectedService: app.selectedService ?? "",
    selectedPackage: app.selectedPackage ?? "",
    address: app.address ?? "",
    note: app.note ?? "",
    userAgreementAccepted: false,
    invoiceFile: null,
    invoiceFileUrl: app.invoiceFileUrl ?? "",
    internetCompany: app.internetCompany ?? "",
    subscriptionNo: app.subscriptionNo ?? "",
    selectedInquiry: app.selectedInquiry ?? "",
    noContractTechType: app.noContractTechType ?? ""
  });

  /**
   * Step 1: resolve existing draft / under-review redirect / or create new draft.
   * @returns {{ redirected?: boolean, error?: boolean, resumed?: boolean, id?: string }}
   */
  const startApplication = async (values) => {
    setStep1Error(null);
    const response = await fetch("/api/applications/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStep1Error(data.error || "تعذر بدء الطلب. حاول مرة أخرى.");
      return { error: true };
    }

    /** Under-review: API returns appIndex only (no application). Resume/created always include application. */
    if (data.appIndex && !data.application) {
      router.push(
        `/internet-basvuru-formu/status/${String(data.appIndex).trim()}`,
      );
      return { redirected: true };
    }

    const app = data.application;
    if (!app?.id) {
      setStep1Error("استجابة غير صالحة من الخادم.");
      return { error: true };
    }

    setApplicationId(app.id);

    if (data.action === "resume") {
      setFormInitialValues(mapApplicationToFormValues(app));
      const { family, vip } = parsePackageDurations(app.selectedPackage);
      if (family) setFamilyContractDuration(family);
      if (vip) setVipContractDuration(vip);
      setStepDirection("forward");
      setStep(typeof app.step === "number" && app.step >= 1 ? app.step : 1);
      return { id: app.id, resumed: true };
    }

    return { id: app.id, resumed: false };
  };

  const updateDraftByStep = async (id, values, currentStep) => {
    if (currentStep === 6) {
      const formData = new FormData();
      formData.append("address", values.address || "");
      formData.append("note", values.note || "");
      formData.append("step", String(currentStep));
      formData.append("internetCompany", values.internetCompany || "");
      formData.append("subscriptionNo", values.subscriptionNo || "");
      if (values.invoiceFile) {
        formData.append("invoiceFile", values.invoiceFile);
      }

      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update final draft data.");
      }
      return;
    }

    const payload = { step: currentStep };
    if (currentStep === 1) {
      payload.name = values.name;
      payload.phone = values.phone;
    }
    if (currentStep === 2) payload.hasInternet = values.hasInternet;
    if (currentStep === 3) payload.serviceType = values.serviceType;
    if (currentStep === 4) {
      payload.contractPreference = values.contractPreference;
      payload.selectedService = values.selectedService;
      payload.selectedInquiry = values.selectedInquiry;
    }
    if (currentStep === 5) {
      payload.selectedPackage = values.selectedPackage;
      payload.noContractTechType = values.noContractTechType;
    }

    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update application draft.");
    }
  };

  const handleSubmit = async (values) => {
    let resolvedId = applicationId;

    if (step === 1) {
      const start = await startApplication(values);
      if (start.redirected) return;
      if (start.error) return;
      resolvedId = start.id;
      if (start.resumed) {
        await updateDraftByStep(resolvedId, values, 1);
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } else {
      if (!resolvedId) {
        setStep1Error(
          "انتهت الجلسة. ارجع للخطوة الأولى وأعد إدخال الاسم والهاتف.",
        );
        return;
      }
    }

    await updateDraftByStep(resolvedId, values, step);

    if (step === 6) {
      setConfirmValues(values);
      setIsConfirmOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStepDirection("forward");
    setStep(getNextStep(step, values));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmSubmission = async () => {
    if (!applicationId) {
      throw new Error("Draft application id is missing.");
    }

    const response = await fetch(`/api/applications/${applicationId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 6 }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit application.");
    }

    const result = await response.json();
    setSubmissionInfo(result);
    setIsConfirmOpen(false);
    setIsCompleted(true);
  };

  const handleBack = (values) => {
    if (step === 1) return;
    setStepDirection("back");
    setStep(getPreviousStep(step, values));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleForward = (values) => {
    formRef.current.validateForm().then((currentErrors) => {
      const fieldOrder = getStepFieldOrder(step, values);
      const orderedErrors = fieldOrder.filter((key) => currentErrors?.[key]);
      const remainingErrors = Object.keys(currentErrors || {})
        .filter((key) => currentErrors?.[key])
        .filter((key) => !orderedErrors.includes(key));
      const allErrorsInOrder = [...orderedErrors, ...remainingErrors];

      if (allErrorsInOrder.length === 0) {
        formRef.current.submitForm();
      } else {
        const touchedFields = allErrorsInOrder.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        formRef.current.setTouched(touchedFields, true);
      }
    });
  };

  return {
    step,
    isCompleted,
    stepDirection,
    familyContractDuration,
    vipContractDuration,
    isConfirmOpen,
    confirmValues,
    submissionInfo,
    formRef,
    formInitialValues,
    initialValues,
    step1Error,
    setStep1Error,
    isUserAgreementOpen,
    agreementText: USER_AGREEMENT_TEXT,
    validate,
    handleSubmit,
    handleConfirmSubmission,
    handleBack,
    handleForward,
    handlePhoneChange,
    openUserAgreement,
    closeUserAgreement,
    setFamilyContractDuration,
    setVipContractDuration,
    setIsConfirmOpen,
    setIsCompleted,
  };
};

export { useApplicationForm };
