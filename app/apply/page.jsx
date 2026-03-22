"use client";

import React from "react";
import { Form, Formik } from "formik";
import FooterButtons from "../../components/FooterButtons";
import ProgressBar from "../../components/ProgressBar";
import Header from "../../components/Header";
import ConfirmPopup from "../../components/ConfirmPopup";
import SuccessStep from "../../components/SuccessStep";
import Step1 from "../../components/form/Step1";
import Step2 from "../../components/form/Step2";
import Step3 from "../../components/form/Step3";
import Step4 from "../../components/form/Step4";
import Step5 from "../../components/form/Step5";
import Step6 from "../../components/form/Step6";
import { useApplicationForm } from "../../hooks/ApplicationForm";

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
          {({ setFieldValue, errors, touched, values }) => (
            <Form className="min-h-svh bg-linear-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
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

              <Header step={step} />
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
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      handlePhoneChange={handlePhoneChange}
                      onClearStep1Error={() => setStep1Error(null)}
                    />
                  )}

                  {step === 2 && (
                    <Step2 values={values} errors={errors} touched={touched} />
                  )}

                  {step === 3 && (
                    <Step3 values={values} errors={errors} touched={touched} />
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
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ApplyPage;
