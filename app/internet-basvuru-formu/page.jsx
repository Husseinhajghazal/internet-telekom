"use client";

import React from "react";
import { Form, Formik } from "formik";
import FooterButtons from "../../components/FooterButtons";
import ProgressBar from "../../components/ProgressBar";
import Header from "../../components/Header";
import ConfirmPopup from "../../components/ConfirmPopup";
import UserAgreementPopup from "../../components/UserAgreementPopup";
import SuccessStep from "../../components/SuccessStep";
import Step1 from "../../components/form/Step1";
import Step2 from "../../components/form/Step2";
import Step3 from "../../components/form/Step3";
import Step4 from "../../components/form/Step4";
import Step5 from "../../components/form/Step5";
import Step6 from "../../components/form/Step6";
import { useApplicationForm } from "../../hooks/ApplicationForm";
import { SIDEBAR_CONTENT } from "../../utils/data";

const ApplyPage = () => {
  const {
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
    step1Error,
    isUserAgreementOpen,
    agreementText,
    validate,
    handleSubmit,
    handleConfirmSubmission,
    handleBack,
    handleForward,
    handlePhoneChange,
    setFamilyContractDuration,
    setVipContractDuration,
    setIsConfirmOpen,
    setStep1Error,
    openUserAgreement,
    closeUserAgreement,
  } = useApplicationForm();

  return (
    <div className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 overflow-x-hidden">
      {isCompleted ? (
        <SuccessStep submissionInfo={submissionInfo} />
      ) : (
        <Formik
          initialValues={formInitialValues}
          enableReinitialize
          validate={validate}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          {({ setFieldValue, errors, touched, values }) => {
            const stepData =
              step === 4
                ? SIDEBAR_CONTENT.step4[values.serviceType] || SIDEBAR_CONTENT.step4.services
                : SIDEBAR_CONTENT[`step${step}`] || SIDEBAR_CONTENT.step1;

            const {
              image: sideImage,
              title: sideTitle,
              description: sideDesc,
              iconPaths,
            } = stepData;

            const sideIcon = (
              <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {iconPaths.map((pathObj, idx) => (
                  <path
                    key={idx}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    {...pathObj}
                  />
                ))}
              </svg>
            );

            return (
              <Form className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 flex flex-row">
                <div className="flex-1 lg:w-[70%] flex flex-col min-h-svh shrink-0 relative">
                  {step === 1 && step1Error && (
                <div
                  key={step1Error}
                  className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-right text-red-800 text-sm"
                  role="alert"
                >
                  {step1Error}
                </div>
              )}
              {isConfirmOpen && (
                <ConfirmPopup
                  confirmValues={confirmValues}
                  handleConfirm={handleConfirmSubmission}
                  handleCancel={() => setIsConfirmOpen(false)}
                />
              )}
              {isUserAgreementOpen && (
                <UserAgreementPopup
                  agreementText={agreementText}
                  handleCancel={closeUserAgreement}
                />
              )}
              <ProgressBar step={step} />

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
                    <Step1
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      handlePhoneChange={handlePhoneChange}
                      onClearStep1Error={() => setStep1Error(null)}
                      onOpenUserAgreement={openUserAgreement}
                    />
                  )}

                  {step === 2 && (
                    <Step2 values={values} errors={errors} touched={touched} />
                  )}

                  {step === 3 && (
                    <Step3
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  )}

                  {step === 4 && (
                    <Step4 values={values} errors={errors} touched={touched} />
                  )}

                  {step === 5 && (
                    <Step5
                      values={values}
                      errors={errors}
                      touched={touched}
                      familyContractDuration={familyContractDuration}
                      vipContractDuration={vipContractDuration}
                      setFamilyContractDuration={setFamilyContractDuration}
                      setVipContractDuration={setVipContractDuration}
                      setFieldValue={setFieldValue}
                    />
                  )}

                  {step === 6 && (
                    <Step6
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  )}
                </div>
              </div>

              <FooterButtons
                step={step}
                handleBack={() => handleBack(values)}
                handleForward={() => handleForward(values)}
              />
                </div>

                <div className="hidden lg:block lg:w-[30%] shrink-0">
                  <div className="fixed top-0 left-0 lg:w-[30%] h-svh bg-blue-50 overflow-hidden">
                    {/* Gradient Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/20 z-10 pointer-events-none"></div>
                    
                    {/* Decorative touches */}
                    <div key={sideTitle} className="absolute bottom-16 left-10 right-10 z-20 text-white flex flex-col gap-5 drop-shadow-xl animate-step-in-right">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
                        {sideIcon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-3 tracking-wide">{sideTitle}</h3>
                        <p className="text-white/80 text-sm leading-relaxed opacity-95">
                          {sideDesc}
                        </p>
                      </div>
                    </div>

                    <img
                      key={sideImage}
                      src={sideImage}
                      alt="Step visual"
                      className="w-full h-full object-cover animate-step-in-right relative z-0"
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default ApplyPage;
