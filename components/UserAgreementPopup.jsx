import React from "react";

const UserAgreementPopup = ({ agreementText, handleCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCancel} />
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
          >
            إغلاق
          </button>
          <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
            اتفاقية المستخدم
          </h3>
        </div>
        <div className="max-h-[calc(90vh-72px)] overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-5 py-5 sm:px-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <pre className="font-sans whitespace-pre-wrap text-right text-sm leading-7 text-slate-700 sm:text-[15px]">
              {agreementText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAgreementPopup;
