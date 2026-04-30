import React from "react";

const UserAgreementPopup = ({ agreementText, handleCancel, handleAgree }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div
        className="relative w-full max-w-3xl flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        style={{ maxHeight: "calc(100dvh - 125px)" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
          >
            X
          </button>
          <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
            اتفاقية المستخدم
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto bg-linear-to-b from-slate-50 to-white px-5 py-5 sm:px-6 min-h-0">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <pre className="font-sans whitespace-pre-wrap text-right text-sm leading-7 text-slate-700 sm:text-[15px]">
              {agreementText}
            </pre>
          </div>
        </div>
        {handleAgree && (
          <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleAgree}
              className="w-full rounded-2xl bg-[#18a2e3] py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#0d8bc9] active:scale-[0.98]"
            >
              قرأت وفهمت
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAgreementPopup;
