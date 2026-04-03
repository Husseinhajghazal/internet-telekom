import React from "react";

const FooterButtons = ({ step, handleBack, handleForward }) => {
  return (
    <div className="p-6">
      <div className="max-w-md mx-auto flex gap-4">
        <button
          type="button"
          onClick={
            step === 1 ? () => (window.location.href = "/start") : handleBack
          }
          className="text-sm md:text-base flex-1 cursor-pointer bg-linear-to-r from-[#18a2e3] to-[#0d8bc9] text-white py-3 px-6 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {step === 1 ? "الصفحة الرئيسية" : "رجوع"}
        </button>
        <button
          type="button"
          onClick={handleForward}
          className={`text-sm md:text-base cursor-pointer flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 bg-linear-to-r from-[#f36802] to-[#ffb245] text-white shadow-lg hover:shadow-xl`}
        >
          {step === 6 ? "إرسال الطلب" : "متابعة"}
        </button>
      </div>
    </div>
  );
};

export default FooterButtons;
